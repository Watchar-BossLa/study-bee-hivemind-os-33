
import { CouncilVote } from '../../types/councils';
import { ConsensusCalculator, ConsensusOptions } from './ConsensusCalculator';

export type { ConsensusOptions } from './ConsensusCalculator';

/**
 * Service responsible for handling consensus operations
 * Delegates calculation to ConsensusCalculator
 */
export class ConsensusService {
  private calculator: ConsensusCalculator;

  constructor() {
    this.calculator = new ConsensusCalculator();
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
}
