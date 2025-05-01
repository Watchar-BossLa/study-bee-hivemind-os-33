
import { CouncilVote, CouncilDecision } from '../../types/councils';

export interface VoteHistorySummary {
  topicId: string;
  councilId: string;
  timestamp: Date;
  consensus: string;
  confidenceScore: number;
  participantCount: number;
  votingDistribution: Record<string, number>; // suggestion -> count
  averageConfidence: number;
  timeToConsensus?: number; // in ms
}

/**
 * Stores and analyzes voting history for councils
 */
export class VoteHistoryStorage {
  private voteHistory: VoteHistorySummary[] = [];
  private readonly maxHistorySize: number = 50;
  private voteCache: Map<string, CouncilDecision> = new Map();
  private readonly cacheTTL: number = 10 * 60 * 1000; // 10 minutes in ms
  
  /**
   * Record votes in history
   */
  public recordVotes(
    topicId: string,
    votes: CouncilVote[],
    consensus: string,
    confidence: number
  ): void {
    // Create a simplified decision object for recording
    const decision: CouncilDecision = {
      topic: topicId,
      votes: [...votes],
      consensus,
      confidenceScore: confidence,
      timestamp: new Date()
    };
    
    // Store in cache with fake councilId for testing purposes
    this.addVoteToHistory(decision, 'test-council', topicId);
  }
  
  /**
   * Add a new vote decision to history and cache
   */
  public addVoteToHistory(
    decision: CouncilDecision,
    councilId: string,
    topicId: string,
    timeToConsensus?: number
  ): void {
    // Create vote distribution record
    const votingDistribution: Record<string, number> = {};
    for (const vote of decision.votes) {
      votingDistribution[vote.suggestion] = (votingDistribution[vote.suggestion] || 0) + 1;
    }
    
    // Calculate average confidence
    const avgConfidence = decision.votes.reduce(
      (sum, vote) => sum + vote.confidence, 0
    ) / decision.votes.length;
    
    // Create history entry
    const historySummary: VoteHistorySummary = {
      topicId,
      councilId,
      timestamp: decision.timestamp,
      consensus: decision.consensus,
      confidenceScore: decision.confidenceScore,
      participantCount: decision.votes.length,
      votingDistribution,
      averageConfidence: avgConfidence,
      timeToConsensus
    };
    
    // Add to history, maintaining max size
    this.voteHistory.unshift(historySummary);
    if (this.voteHistory.length > this.maxHistorySize) {
      this.voteHistory.pop();
    }
    
    // Add to cache with expiration
    const cacheKey = this.generateCacheKey(topicId, councilId);
    this.voteCache.set(cacheKey, decision);
    
    // Set expiration for cache entry
    setTimeout(() => {
      this.voteCache.delete(cacheKey);
    }, this.cacheTTL);
  }
  
  /**
   * Check cache for similar topic decision
   */
  public getCachedDecision(
    topic: string,
    councilId: string
  ): CouncilDecision | undefined {
    // Generate cache key and check cache
    const cacheKey = this.generateCacheKey(topic, councilId);
    return this.voteCache.get(cacheKey);
  }
  
  /**
   * Get vote history for a specific council or all councils
   */
  public getVoteHistory(topicId?: string): CouncilDecision[] {
    if (!topicId) {
      return Array.from(this.voteCache.values());
    }
    
    // Convert the historical summaries to CouncilDecision objects
    const matchingDecisions: CouncilDecision[] = [];
    
    for (const [key, decision] of this.voteCache.entries()) {
      if (key.includes(topicId)) {
        matchingDecisions.push(decision);
      }
    }
    
    return matchingDecisions;
  }
  
  /**
   * Get agent performance metrics based on voting
   */
  public getAgentConsensusAlignment(agentId: string): number | undefined {
    // Count how often agent voted with final consensus
    let alignedVotes = 0;
    let totalVotes = 0;
    
    for (const decision of this.voteCache.values()) {
      const agentVote = decision.votes.find(vote => vote.agentId === agentId);
      if (agentVote) {
        totalVotes++;
        if (agentVote.suggestion === decision.consensus) {
          alignedVotes++;
        }
      }
    }
    
    return totalVotes > 0 ? alignedVotes / totalVotes : undefined;
  }
  
  /**
   * Generate cache key from topic and council ID
   */
  private generateCacheKey(topic: string, councilId: string): string {
    // Create a simplified topic key by removing common words and normalizing
    const simplifiedTopic = topic.toLowerCase()
      .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|with|by|of|about)\b/g, '')
      .trim()
      .replace(/\s+/g, '_');
    
    return `${councilId}:${simplifiedTopic}`;
  }
}
