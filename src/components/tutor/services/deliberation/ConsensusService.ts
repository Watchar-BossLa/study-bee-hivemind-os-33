
import { CouncilVote, CouncilDecision } from '../../types/councils';
import { ConsensusCalculator, ConsensusOptions } from './ConsensusCalculator';
import { VoteIntegrityService } from './VoteIntegrityService';
import { VoteHistoryStorage } from './VoteHistoryStorage';
import { VoteWeightCalculator } from './VoteWeightCalculator';

export type { ConsensusOptions } from './ConsensusCalculator';

interface ProcessVoteResult {
  consensus: string;
  confidenceScore: number;
  votes: CouncilVote[];
}

/**
 * Service responsible for handling consensus operations
 * Delegates calculation to ConsensusCalculator and other services
 */
export class ConsensusService {
  private calculator: ConsensusCalculator;
  private integrityService: VoteIntegrityService;
  private historyStorage: VoteHistoryStorage;
  private weightCalculator: VoteWeightCalculator;

  constructor(
    calculator?: ConsensusCalculator,
    integrityService?: VoteIntegrityService,
    historyStorage?: VoteHistoryStorage,
    weightCalculator?: VoteWeightCalculator
  ) {
    this.calculator = calculator || new ConsensusCalculator();
    this.integrityService = integrityService || new VoteIntegrityService();
    this.historyStorage = historyStorage || new VoteHistoryStorage();
    this.weightCalculator = weightCalculator || new VoteWeightCalculator();
  }

  /**
   * Calculate consensus using weighted voting and adaptive thresholds
   */
  public calculateConsensus(
    votes: CouncilVote[],
    suggestionGroups: Map<string, CouncilVote[]>,
    options?: ConsensusOptions
  ): { suggestion: string; confidence: number } {
    return this.calculator.calculateConsensus(votes, suggestionGroups, options);
  }
  
  /**
   * Check if consensus meets the required threshold
   */
  public isConsensusReached(
    confidence: number,
    options?: ConsensusOptions
  ): boolean {
    return this.calculator.isConsensusReached(confidence, options);
  }

  /**
   * Process votes for a topic and reach consensus
   */
  public async processVotes(
    topicId: string,
    votes: CouncilVote[]
  ): Promise<ProcessVoteResult> {
    // Validate votes before processing
    if (!this.integrityService.validateVotes(votes)) {
      throw new Error('Invalid votes detected');
    }

    // Calculate vote weights
    const weights = this.weightCalculator.calculateWeights(votes);
    
    // Group votes by suggestion
    const suggestionGroups = new Map<string, CouncilVote[]>();
    for (const vote of votes) {
      if (!suggestionGroups.has(vote.suggestion)) {
        suggestionGroups.set(vote.suggestion, []);
      }
      suggestionGroups.get(vote.suggestion)?.push(vote);
    }
    
    // Calculate consensus
    const { suggestion, confidence } = this.calculator.calculateConsensus(
      votes, 
      suggestionGroups
    );
    
    // Record votes in history
    this.historyStorage.recordVotes(topicId, votes, suggestion, confidence);
    
    return {
      consensus: suggestion,
      confidenceScore: confidence,
      votes
    };
  }

  /**
   * Retrieve historical consensus data for a topic
   */
  public async getHistoricalConsensus(topicId: string): Promise<CouncilDecision[]> {
    return this.historyStorage.getVoteHistory(topicId);
  }
}
