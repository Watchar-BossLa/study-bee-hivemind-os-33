
import { CouncilVote } from '../../types/councils';
import { VoteHistoryStorage } from './VoteHistoryStorage';
import { VoteWeightCalculator } from './VoteWeightCalculator';
import { VoteIntegrityService } from './VoteIntegrityService';
import { SpecializedAgent } from '../../types/agents';

interface PlanTask {
  taskId: string;
  description: string;
  status: string;
  assignedAgentId?: string;
}

export interface Plan {
  planId: string;
  type: string;
  summary: string;
  tasks?: PlanTask[];
}

// Define the VotingOptions interface that's used in DeliberationProcessor
export interface VotingOptions {
  baseThreshold?: number;
  minRequiredVotes?: number;
  timeLimit?: number;
  complexityOverride?: 'low' | 'medium' | 'high';
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
    agent: SpecializedAgent, 
    topicId: string, 
    suggestion: string,
    confidence: number,
    reasoning: string = ''
  ): CouncilVote {
    const weight = this.weightCalculator.calculateWeight(agent.id, topicId);
    
    const vote: CouncilVote = {
      agentId: agent.id,
      suggestion,
      confidence,
      reasoning,
    };
    
    if (this.integrityService.verifyVote(vote)) {
      this.historyStorage.recordVotes(topicId, [vote]);
      return vote;
    } else {
      throw new Error('Vote integrity check failed');
    }
  }
  
  public getVotesForTopic(councilId: string, topicId: string): CouncilVote[] {
    console.log(`Getting votes for council ${councilId}, topic ${topicId}`);
    return [];
  }
  
  public calculateConsensusScore(votes: CouncilVote[]): number {
    if (votes.length === 0) return 0;
    
    const suggestions = new Map<string, { count: number; weightedScore: number }>();
    let totalWeight = 0;
    
    votes.forEach(vote => {
      if (!suggestions.has(vote.suggestion)) {
        suggestions.set(vote.suggestion, { count: 0, weightedScore: 0 });
      }
      
      const current = suggestions.get(vote.suggestion)!;
      current.count += 1;
      // Since weight doesn't exist on CouncilVote, we'll use a default weight of 1
      const weight = 1;
      current.weightedScore += weight * vote.confidence;
      totalWeight += weight;
    });
    
    // Find the suggestion with the highest weighted score
    let highestScore = 0;
    
    suggestions.forEach(value => {
      if (value.weightedScore > highestScore) {
        highestScore = value.weightedScore;
      }
    });
    
    return totalWeight > 0 ? highestScore / totalWeight : 0;
  }
  
  public getMajorityDecision(votes: CouncilVote[]): string | null {
    if (votes.length === 0) return null;
    
    const suggestions = new Map<string, number>();
    
    votes.forEach(vote => {
      const currentCount = suggestions.get(vote.suggestion) || 0;
      // Since weight doesn't exist on CouncilVote, we'll use a default weight of 1
      const weight = 1;
      suggestions.set(vote.suggestion, currentCount + (weight * vote.confidence));
    });
    
    let highestCount = 0;
    let majorityDecision = null;
    
    suggestions.forEach((count, suggestion) => {
      if (count > highestCount) {
        highestCount = count;
        majorityDecision = suggestion;
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
        if (!task.assignedAgentId) {
          task.assignedAgentId = agentId;
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

  // Implementing the missing methods required by DeliberationProcessor
  public collectVotes(
    council: SpecializedAgent[], 
    topic: string, 
    options?: VotingOptions
  ): CouncilVote[] {
    console.log(`Collecting votes from council for topic: ${topic}`);
    // Implementation would gather votes from council members
    const votes: CouncilVote[] = [];
    council.forEach(agent => {
      votes.push({
        agentId: agent.id,
        suggestion: `Suggestion from ${agent.name}`,
        confidence: 0.8,
        reasoning: `Reasoning from ${agent.name}`
      });
    });
    return votes;
  }

  public collectVotesWithPlan(
    council: SpecializedAgent[], 
    topic: string, 
    plan: Plan, 
    options?: VotingOptions
  ): CouncilVote[] {
    console.log(`Collecting votes from council for topic: ${topic} with plan`);
    // Implementation would gather votes with plan consideration
    const votes: CouncilVote[] = [];
    council.forEach(agent => {
      votes.push({
        agentId: agent.id,
        suggestion: `Plan-based suggestion from ${agent.name}`,
        confidence: 0.85,
        reasoning: `Plan-based reasoning from ${agent.name}`
      });
    });
    return votes;
  }

  public groupVotesBySuggestion(votes: CouncilVote[]): Map<string, CouncilVote[]> {
    const groups = new Map<string, CouncilVote[]>();
    
    votes.forEach(vote => {
      if (!groups.has(vote.suggestion)) {
        groups.set(vote.suggestion, []);
      }
      groups.get(vote.suggestion)!.push(vote);
    });
    
    return groups;
  }

  public detectSuspiciousVotes(votes: CouncilVote[]): CouncilVote[] {
    // Simple implementation to detect suspicious votes
    return votes.filter(vote => vote.confidence > 0.95 || vote.confidence < 0.05);
  }
}
