
import { CouncilVote } from '../../types/councils';
import { VoteHistoryStorage } from './VoteHistoryStorage';
import { VoteWeightCalculator } from './VoteWeightCalculator';
import { VoteIntegrityService } from './VoteIntegrityService';
import { SpecializedAgent } from '../../types/agents';
import { VoteAnalyzer } from './VoteAnalyzer';
import { VoteCollector } from './VoteCollector';
import { PlanVoter } from './PlanVoter';
import { Plan, VotingOptions } from './types/votingTypes';

export { Plan, VotingOptions };

export class VotingService {
  private historyStorage: VoteHistoryStorage;
  private weightCalculator: VoteWeightCalculator;
  private integrityService: VoteIntegrityService;
  private analyzer: VoteAnalyzer;
  private collector: VoteCollector;
  private planVoter: PlanVoter;

  constructor() {
    this.historyStorage = new VoteHistoryStorage();
    this.weightCalculator = new VoteWeightCalculator();
    this.integrityService = new VoteIntegrityService();
    this.analyzer = new VoteAnalyzer();
    this.collector = new VoteCollector();
    this.planVoter = new PlanVoter();
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
  
  // Delegate to VoteAnalyzer
  public calculateConsensusScore(votes: CouncilVote[]): number {
    return this.analyzer.calculateConsensusScore(votes);
  }
  
  public getMajorityDecision(votes: CouncilVote[]): string | null {
    return this.analyzer.getMajorityDecision(votes);
  }
  
  public groupVotesBySuggestion(votes: CouncilVote[]): Map<string, CouncilVote[]> {
    return this.analyzer.groupVotesBySuggestion(votes);
  }
  
  public detectSuspiciousVotes(votes: CouncilVote[]): CouncilVote[] {
    return this.analyzer.detectSuspiciousVotes(votes);
  }
  
  // Delegate to PlanVoter
  public voteOnPlan(plan: Plan, agentId: string, approve: boolean, reason: string): void {
    this.planVoter.voteOnPlan(plan, agentId, approve, reason);
  }
  
  public getLatestVoteTrends(): Map<string, { up: number; down: number }> {
    return this.planVoter.getLatestVoteTrends();
  }

  // Delegate to VoteCollector
  public collectVotes(
    council: SpecializedAgent[], 
    topic: string, 
    options?: VotingOptions
  ): CouncilVote[] {
    return this.collector.collectVotes(council, topic, options);
  }

  public collectVotesWithPlan(
    council: SpecializedAgent[], 
    topic: string, 
    plan: Plan, 
    options?: VotingOptions
  ): CouncilVote[] {
    return this.collector.collectVotesWithPlan(council, topic, plan, options);
  }
}
