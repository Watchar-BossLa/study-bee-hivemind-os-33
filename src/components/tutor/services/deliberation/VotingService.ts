import { CouncilVote } from '../../types/councils';
import { VoteHistoryStorage } from './VoteHistoryStorage';
import { VoteWeightCalculator } from './VoteWeightCalculator';
import { VoteIntegrityService } from './VoteIntegrityService';
import { SpecializedAgent } from '../../types/agents';
import { VoteAnalysisService } from './VoteAnalysisService';
import { VoteCollectionService } from './VoteCollectionService';
import { PlanVotingService } from './PlanVotingService';
import { Plan, VotingOptions } from './types/voting-types';

// Changed to "export type" to fix TS1205 error
export type { VotingOptions } from './types/voting-types';

export class VotingService {
  private historyStorage: VoteHistoryStorage;
  private weightCalculator: VoteWeightCalculator;
  private integrityService: VoteIntegrityService;
  private analysisService: VoteAnalysisService;
  private collectionService: VoteCollectionService;
  private planVotingService: PlanVotingService;

  constructor() {
    this.historyStorage = new VoteHistoryStorage();
    this.weightCalculator = new VoteWeightCalculator();
    this.integrityService = new VoteIntegrityService();
    this.analysisService = new VoteAnalysisService();
    this.collectionService = new VoteCollectionService();
    this.planVotingService = new PlanVotingService();
  }

  public registerVote(
    councilId: string, 
    agent: SpecializedAgent,
    topicId: string, 
    suggestion: string,
    confidence: number,
    reasoning: string
  ): CouncilVote {
    // Pass the agent object directly to calculateWeight which now accepts SpecializedAgent
    const weight = this.weightCalculator.calculateWeight(agent, topicId);
    
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
  
  // Delegated to VoteAnalysisService
  public calculateConsensusScore(votes: CouncilVote[]): number {
    return this.analysisService.calculateConsensusScore(votes);
  }
  
  public getMajorityDecision(votes: CouncilVote[]): string | null {
    return this.analysisService.getMajorityDecision(votes);
  }
  
  // Delegated to PlanVotingService
  public voteOnPlan(plan: Plan, agentId: string, approve: boolean, reason: string): void {
    this.planVotingService.voteOnPlan(plan, agentId, approve, reason);
  }
  
  public getLatestVoteTrends(): Map<string, { up: number; down: number }> {
    const trends = new Map<string, { up: number; down: number }>();
    
    // Simulate trends calculation
    trends.set('risk_assessment', { up: 7, down: 2 });
    trends.set('efficiency', { up: 5, down: 4 });
    trends.set('creativity', { up: 9, down: 1 });
    
    return trends;
  }

  // Delegated to VoteCollectionService
  public collectVotes(
    council: SpecializedAgent[], 
    topic: string, 
    options?: VotingOptions
  ): CouncilVote[] {
    return this.collectionService.collectVotes(council, topic, options);
  }

  public collectVotesWithPlan(
    council: SpecializedAgent[], 
    topic: string, 
    plan: any, 
    options?: VotingOptions
  ): CouncilVote[] {
    return this.collectionService.collectVotesWithPlan(council, topic, plan, options);
  }

  // Delegated to VoteAnalysisService
  public groupVotesBySuggestion(votes: CouncilVote[]): Map<string, CouncilVote[]> {
    return this.analysisService.groupVotesBySuggestion(votes);
  }

  public detectSuspiciousVotes(votes: CouncilVote[]): CouncilVote[] {
    return this.analysisService.detectSuspiciousVotes(votes);
  }
}
