
import { CouncilVote, CouncilDecision } from '../../types/councils';

interface VoteHistoryEntry {
  votes: CouncilVote[];
  topic: string;
  timestamp: Date;
  councilId: string;
}

interface DecisionHistoryEntry {
  decision: CouncilDecision;
  councilId: string;
  topicId: string;
  timeToDecide: number;
  timestamp: Date;
}

export class VoteHistoryStorage {
  private voteHistory: VoteHistoryEntry[] = [];
  private decisionHistory: DecisionHistoryEntry[] = [];
  private decisionCache: Map<string, CouncilDecision> = new Map();

  /**
   * Add votes to history
   */
  public addVotes(votes: CouncilVote[], topic: string): void {
    this.voteHistory.push({
      votes,
      topic,
      timestamp: new Date(),
      councilId: this.extractCouncilId(votes)
    });
  }

  /**
   * Record votes to history
   */
  public recordVotes(
    topicId: string,
    votes: CouncilVote[],
    consensus: string,
    confidence: number
  ): void {
    this.voteHistory.push({
      votes,
      topic: topicId,
      timestamp: new Date(),
      councilId: this.extractCouncilId(votes)
    });
  }

  /**
   * Add a council decision to vote history
   */
  public addVoteToHistory(
    decision: CouncilDecision,
    councilId: string,
    topicId: string,
    timeToDecide: number
  ): void {
    this.decisionHistory.push({
      decision,
      councilId,
      topicId,
      timeToDecide,
      timestamp: new Date()
    });

    // Cache the decision for quick lookup
    this.decisionCache.set(this.generateCacheKey(topicId, councilId), decision);
  }

  /**
   * Get cached decision for a topic and council
   */
  public getCachedDecision(topic: string, councilId: string): CouncilDecision | undefined {
    const cacheKey = this.generateCacheKey(topic, councilId);
    return this.decisionCache.get(cacheKey);
  }

  /**
   * Get vote history for a topic
   */
  public getVoteHistory(topicId: string): CouncilDecision[] {
    return this.decisionHistory
      .filter(entry => entry.topicId === topicId)
      .map(entry => entry.decision);
  }

  /**
   * Get all vote history
   */
  public getAllVoteHistory(): VoteHistoryEntry[] {
    return [...this.voteHistory];
  }

  /**
   * Generate a cache key for a topic and council
   */
  private generateCacheKey(topic: string, councilId: string): string {
    return `${councilId}:${topic}`;
  }

  /**
   * Extract council ID from votes
   */
  private extractCouncilId(votes: CouncilVote[]): string {
    // Extract unique agent IDs and sort them to create a deterministic council ID
    const agentIds = [...new Set(votes.map(vote => vote.agentId))].sort();
    return agentIds.join('-');
  }
}
