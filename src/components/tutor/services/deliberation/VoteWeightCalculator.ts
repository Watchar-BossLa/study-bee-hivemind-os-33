import { SpecializedAgent } from '../../types/agents';
import { CouncilVote } from '../../types/councils';

/**
 * Utility for calculating vote weights based on agent expertise and performance
 */
export class VoteWeightCalculator {
  /**
   * Calculate the voting weight of an agent for a specific topic
   */
  public calculateWeight(
    agent: SpecializedAgent,
    topic: string,
    performanceHistory?: {
      topicAccuracy?: number;
      overallAccuracy?: number;
      userFeedback?: number;
    }
  ): number {
    // Base weight calculation from domain/topic match
    const expertiseMatch = this.calculateExpertiseMatch(agent.domain, agent.expertise, topic);
    
    // Start with a base weight
    let weight = 0.6 + (expertiseMatch * 0.4);
    
    // Factor in historical performance data if available
    if (performanceHistory) {
      // Topic-specific accuracy is weighted highest
      if (performanceHistory.topicAccuracy !== undefined) {
        weight += performanceHistory.topicAccuracy * 0.15;
      }
      
      // Overall accuracy has moderate weight
      if (performanceHistory.overallAccuracy !== undefined) {
        weight += performanceHistory.overallAccuracy * 0.1;
      }
      
      // User feedback is also factored in
      if (performanceHistory.userFeedback !== undefined) {
        weight += (performanceHistory.userFeedback / 5) * 0.1; // Assuming 0-5 scale
      }
    }
    
    // Consider agent's adaptability if available
    if (agent.adaptability !== undefined) {
      weight += agent.adaptability * 0.05;
    }
    
    // Consider collaboration score for complex topics
    if (agent.collaborationScore !== undefined && this.isComplexTopic(topic)) {
      weight += agent.collaborationScore * 0.05;
    }
    
    // Ensure weight is within reasonable bounds (0.5-1.0)
    return Math.min(Math.max(weight, 0.5), 1.0);
  }

  /**
   * Calculate weights for multiple votes
   */
  public calculateWeights(votes: CouncilVote[]): Map<string, number> {
    const weights = new Map<string, number>();
    
    // Assign default weights based on vote confidence
    for (const vote of votes) {
      weights.set(vote.agentId, 0.6 + (vote.confidence * 0.3));
    }
    
    return weights;
  }

  /**
   * Calculate expertise match between agent domain/expertise and topic
   */
  private calculateExpertiseMatch(
    domain: string, 
    expertise: string[],
    topic: string
  ): number {
    const topicLower = topic.toLowerCase();
    const domainLower = domain.toLowerCase();
    
    // Check direct domain match
    const domainMatch = domainLower.includes(topicLower) || topicLower.includes(domainLower) ? 0.7 : 0.3;
    
    // Check expertise match
    let expertiseMatch = 0;
    for (const exp of expertise) {
      const expLower = exp.toLowerCase();
      if (topicLower.includes(expLower) || expLower.includes(topicLower)) {
        expertiseMatch = Math.max(expertiseMatch, 0.9);
      } else if (this.areRelated(expLower, topicLower)) {
        expertiseMatch = Math.max(expertiseMatch, 0.6);
      }
    }
    
    // Return best match between domain and expertise
    return Math.max(domainMatch, expertiseMatch);
  }
  
  /**
   * Determine if a topic is complex based on keywords and structure
   */
  private isComplexTopic(topic: string): boolean {
    const complexityIndicators = [
      'advanced', 'complex', 'detailed', 'comprehensive',
      'relationship between', 'compare and contrast',
      'analyze', 'synthesis', 'evaluation'
    ];
    
    return complexityIndicators.some(indicator => 
      topic.toLowerCase().includes(indicator)
    );
  }
  
  /**
   * Determine if two terms are semantically related
   */
  private areRelated(term1: string, term2: string): boolean {
    const minLength = Math.min(term1.length, term2.length);
    const commonLength = 3; // Minimum common substring length to consider related
    
    if (minLength < commonLength) return false;
    
    for (let i = 0; i <= term1.length - commonLength; i++) {
      const substring = term1.substring(i, i + commonLength);
      if (term2.includes(substring)) {
        return true;
      }
    }
    
    return false;
  }
}
