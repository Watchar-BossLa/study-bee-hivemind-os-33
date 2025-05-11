
import { CouncilVote } from '../../types/councils';
import { VoteHistoryStorage } from './VoteHistoryStorage';
import { VoteWeightCalculator } from './VoteWeightCalculator';
import { VoteIntegrityService } from './VoteIntegrityService';

interface PlanTask {
  taskId: string;
  description: string;
  status: string;
  assignedAgentId?: string; // Changed from assignedTo to assignedAgentId
}

interface Plan {
  planId: string;
  type: string;
  summary: string;
  tasks?: PlanTask[];
}

export class VotingService {
  private historyStorage: VoteHistoryStorage;
  private weightCalculator: VoteWeightCalculator;
  private integrityService: VoteIntegrityService;

  constructor() {
    this.historyStorage = new VoteHistoryStorage();
    this.weightCalculator = new VoteWeightCalculator();
    this.integrityService = new VoteIntegrityService();
  }

  public registerVote(
    councilId: string, 
    agentId: string, 
    topicId: string, 
    decision: string, 
    confidence: number
  ): CouncilVote {
    const voteWeight = this.weightCalculator.calculateVoteWeight(agentId, topicId);
    
    const vote: CouncilVote = {
      councilId,
      agentId,
      topicId,
      decision,
      confidence,
      weight: voteWeight,
      timestamp: new Date().toISOString()
    };
    
    if (this.integrityService.verifyVote(vote)) {
      this.historyStorage.recordVote(vote);
      return vote;
    } else {
      throw new Error('Vote integrity check failed');
    }
  }
  
  public getVotesForTopic(councilId: string, topicId: string): CouncilVote[] {
    return this.historyStorage.getVotesForTopic(councilId, topicId);
  }
  
  public calculateConsensusScore(votes: CouncilVote[]): number {
    if (votes.length === 0) return 0;
    
    const decisions = new Map<string, { count: number; weightedScore: number }>();
    let totalWeight = 0;
    
    votes.forEach(vote => {
      if (!decisions.has(vote.decision)) {
        decisions.set(vote.decision, { count: 0, weightedScore: 0 });
      }
      
      const current = decisions.get(vote.decision)!;
      current.count += 1;
      current.weightedScore += vote.weight * vote.confidence;
      totalWeight += vote.weight;
    });
    
    // Find the decision with the highest weighted score
    let highestScore = 0;
    let majorityDecision = '';
    
    decisions.forEach((value, key) => {
      if (value.weightedScore > highestScore) {
        highestScore = value.weightedScore;
        majorityDecision = key;
      }
    });
    
    return totalWeight > 0 ? highestScore / totalWeight : 0;
  }
  
  public getMajorityDecision(votes: CouncilVote[]): string | null {
    if (votes.length === 0) return null;
    
    const decisions = new Map<string, number>();
    
    votes.forEach(vote => {
      const currentCount = decisions.get(vote.decision) || 0;
      decisions.set(vote.decision, currentCount + (vote.weight * vote.confidence));
    });
    
    let highestCount = 0;
    let majorityDecision = null;
    
    decisions.forEach((count, decision) => {
      if (count > highestCount) {
        highestCount = count;
        majorityDecision = decision;
      }
    });
    
    return majorityDecision;
  }
  
  public voteOnPlan(plan: Plan, agentId: string, approve: boolean, reason: string): void {
    console.log(`Agent ${agentId} voted ${approve ? 'to approve' : 'to reject'} plan ${plan.planId}`);
    console.log(`Reason: ${reason}`);
    
    // If approved and there are tasks, assign them
    if (approve && plan.tasks && plan.tasks.length > 0) {
      plan.tasks.forEach(task => {
        if (!task.assignedAgentId) { // Fixed property access
          // Simple assignment - in a real system this would use agent capabilities
          task.assignedAgentId = agentId; // Fixed property assignment
          console.log(`Task ${task.taskId} assigned to agent ${agentId}`);
        }
      });
    }
  }
  
  public getLatestVoteTrends(): Map<string, { up: number; down: number }> {
    const trends = new Map<string, { up: number; down: number }>();
    
    // Simulate trends calculation
    trends.set('risk_assessment', { up: 7, down: 2 });
    trends.set('efficiency', { up: 5, down: 4 });
    trends.set('creativity', { up: 9, down: 1 });
    
    return trends;
  }
}
