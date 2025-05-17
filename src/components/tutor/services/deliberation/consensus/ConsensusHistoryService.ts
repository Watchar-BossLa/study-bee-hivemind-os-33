
import { CouncilDecision, CouncilVote } from '../../../types/councils';
import { VoteHistoryStorage } from '../VoteHistoryStorage';

/**
 * Service for managing consensus history
 */
export class ConsensusHistoryService {
  private historyStorage: VoteHistoryStorage;
  
  constructor(historyStorage?: VoteHistoryStorage) {
    this.historyStorage = historyStorage || new VoteHistoryStorage();
  }
  
  /**
   * Record a vote result in history
   */
  public recordConsensusResult(
    topicId: string,
    votes: CouncilVote[],
    suggestion: string,
    confidence: number
  ): void {
    this.historyStorage.recordVotes(topicId, votes, suggestion, confidence);
  }
  
  /**
   * Retrieve historical consensus data for a topic
   */
  public async getHistoricalConsensus(topicId: string): Promise<CouncilDecision[]> {
    return this.historyStorage.getVoteHistory(topicId);
  }
}
