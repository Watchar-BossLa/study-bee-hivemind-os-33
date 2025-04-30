
import { CouncilVote } from '../../types/councils';

interface VoteSecurityContext {
  voteHash: string;
  timestamp: number;
  agentId: string;
}

/**
 * Ensures vote integrity and detects potentially malicious voting behavior
 */
export class VoteIntegrityService {
  private voteSecurityContext: Map<string, VoteSecurityContext> = new Map();
  
  /**
   * Generate a secure hash for a vote to prevent tampering
   */
  public secureVote(vote: CouncilVote): string {
    // Create a simple hash of the vote details
    // In production, this would use a proper cryptographic hash
    const voteString = `${vote.agentId}:${vote.suggestion}:${vote.confidence}`;
    const hash = this.simpleHash(voteString);
    
    // Store the security context
    this.voteSecurityContext.set(vote.agentId, {
      voteHash: hash,
      timestamp: Date.now(),
      agentId: vote.agentId
    });
    
    return hash;
  }
  
  /**
   * Verify that a vote hasn't been tampered with
   */
  public verifyVote(vote: CouncilVote): boolean {
    const context = this.voteSecurityContext.get(vote.agentId);
    
    if (!context) {
      return false; // No security context found
    }
    
    // Re-generate hash and compare
    const voteString = `${vote.agentId}:${vote.suggestion}:${vote.confidence}`;
    const hash = this.simpleHash(voteString);
    
    return hash === context.voteHash;
  }
  
  /**
   * Detect outlier votes that might be attempts at vote manipulation
   */
  public detectOutliers(votes: CouncilVote[]): CouncilVote[] {
    if (votes.length < 3) {
      return []; // Not enough votes to detect outliers
    }
    
    // Calculate average confidence
    const avgConfidence = votes.reduce(
      (sum, vote) => sum + vote.confidence, 0
    ) / votes.length;
    
    // Calculate standard deviation
    const squaredDiffs = votes.map(vote => 
      Math.pow(vote.confidence - avgConfidence, 2)
    );
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / votes.length;
    const stdDev = Math.sqrt(avgSquaredDiff);
    
    // Mark votes with confidence more than 2 standard deviations from mean as outliers
    return votes.filter(vote => 
      Math.abs(vote.confidence - avgConfidence) > stdDev * 2
    );
  }
  
  /**
   * Get a simple hash for a string (for demonstration purposes)
   * In production, use a proper cryptographic hash function
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36); // Convert to base-36 string
  }
}
