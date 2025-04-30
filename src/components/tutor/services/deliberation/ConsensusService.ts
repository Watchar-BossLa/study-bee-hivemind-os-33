
import { CouncilVote, CouncilDecision } from '../../types/councils';

export interface ConsensusOptions {
  baseThreshold?: number; // 0-1, default 0.7
  minRequiredVotes?: number;
  timeoutMs?: number;
  topicComplexity?: 'low' | 'medium' | 'high';
}

export class ConsensusService {
  /**
   * Calculate consensus using weighted voting and adaptive thresholds
   */
  public calculateConsensus(
    votes: CouncilVote[],
    suggestionGroups: Map<string, CouncilVote[]>,
    options?: ConsensusOptions
  ): { suggestion: string; confidence: number } {
    let consensusSuggestion = "";
    let highestScore = 0;
    
    if (votes.length === 0) {
      return { suggestion: "", confidence: 0 };
    }
    
    // Weight votes by confidence
    suggestionGroups.forEach((groupVotes, suggestion) => {
      // Calculate weighted score: count + sum of confidences
      const weightedScore = groupVotes.length + groupVotes.reduce((sum, vote) => sum + vote.confidence, 0);
      
      if (weightedScore > highestScore) {
        highestScore = weightedScore;
        consensusSuggestion = suggestion;
      }
    });
    
    // If no consensus could be reached, return empty with 0 confidence
    if (!consensusSuggestion) {
      return { suggestion: "", confidence: 0 };
    }

    // Calculate overall confidence based on proportion of votes and their confidences
    const totalVotesForConsensus = suggestionGroups.get(consensusSuggestion)?.length || 0;
    const confidenceSum = suggestionGroups.get(consensusSuggestion)?.reduce((sum, vote) => sum + vote.confidence, 0) || 0;
    const averageConfidence = confidenceSum / Math.max(totalVotesForConsensus, 1);
    
    // Get adaptive threshold based on options
    const adaptiveThreshold = this.getAdaptiveThreshold(votes.length, options);
    
    // Final confidence is a combination of vote proportion, average confidence, and threshold meeting
    const voteRatio = totalVotesForConsensus / votes.length;
    const thresholdMet = voteRatio >= adaptiveThreshold ? 1 : voteRatio / adaptiveThreshold;
    
    // Weighted combination of factors
    const confidence = (voteRatio * 0.5) + (averageConfidence * 0.3) + (thresholdMet * 0.2);

    return {
      suggestion: consensusSuggestion,
      confidence
    };
  }
  
  /**
   * Get an adaptive consensus threshold based on context
   */
  private getAdaptiveThreshold(
    voteCount: number, 
    options?: ConsensusOptions
  ): number {
    // Base threshold (default 0.7)
    let threshold = options?.baseThreshold || 0.7;
    
    // Adjust based on number of voters (more voters = lower threshold)
    if (voteCount >= 10) {
      threshold -= 0.1;
    } else if (voteCount <= 3) {
      threshold += 0.1;
    }
    
    // Adjust based on topic complexity
    if (options?.topicComplexity === 'high') {
      threshold -= 0.1; // Lower threshold for complex topics
    } else if (options?.topicComplexity === 'low') {
      threshold += 0.05; // Higher threshold for simple topics
    }
    
    // Ensure threshold stays in reasonable range
    return Math.min(Math.max(threshold, 0.5), 0.9);
  }

  public createDecision(
    topic: string,
    votes: CouncilVote[],
    consensus: string,
    confidenceScore: number,
    securityAnalysis?: {
      riskLevel: number;
      recommendations: string[];
      threadId?: string;
    }
  ): CouncilDecision {
    return {
      topic,
      votes,
      consensus,
      confidenceScore,
      timestamp: new Date(),
      securityAnalysis
    };
  }
  
  /**
   * Check if consensus meets the required threshold
   */
  public isConsensusReached(
    confidence: number,
    options?: ConsensusOptions
  ): boolean {
    const threshold = options?.baseThreshold || 0.7;
    return confidence >= threshold;
  }
}
