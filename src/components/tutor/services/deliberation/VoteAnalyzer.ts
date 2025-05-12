
import { CouncilVote } from '../../types/councils';

export class VoteAnalyzer {
  public calculateConsensusScore(votes: CouncilVote[]): number {
    if (votes.length === 0) return 0;
    
    const suggestions = new Map<string, { count: number; weightedScore: number }>();
    let totalWeight = 0;
    
    votes.forEach(vote => {
      if (!suggestions.has(vote.suggestion)) {
        suggestions.set(vote.suggestion, { count: 0, weightedScore: 0 });
      }
      
      const current = suggestions.get(vote.suggestion)!;
      current.count += 1;
      // Since weight doesn't exist on CouncilVote, we'll use a default weight of 1
      const weight = 1;
      current.weightedScore += weight * vote.confidence;
      totalWeight += weight;
    });
    
    // Find the suggestion with the highest weighted score
    let highestScore = 0;
    
    suggestions.forEach(value => {
      if (value.weightedScore > highestScore) {
        highestScore = value.weightedScore;
      }
    });
    
    return totalWeight > 0 ? highestScore / totalWeight : 0;
  }
  
  public getMajorityDecision(votes: CouncilVote[]): string | null {
    if (votes.length === 0) return null;
    
    const suggestions = new Map<string, number>();
    
    votes.forEach(vote => {
      const currentCount = suggestions.get(vote.suggestion) || 0;
      // Since weight doesn't exist on CouncilVote, we'll use a default weight of 1
      const weight = 1;
      suggestions.set(vote.suggestion, currentCount + (weight * vote.confidence));
    });
    
    let highestCount = 0;
    let majorityDecision = null;
    
    suggestions.forEach((count, suggestion) => {
      if (count > highestCount) {
        highestCount = count;
        majorityDecision = suggestion;
      }
    });
    
    return majorityDecision;
  }
  
  public groupVotesBySuggestion(votes: CouncilVote[]): Map<string, CouncilVote[]> {
    const groups = new Map<string, CouncilVote[]>();
    
    votes.forEach(vote => {
      if (!groups.has(vote.suggestion)) {
        groups.set(vote.suggestion, []);
      }
      groups.get(vote.suggestion)!.push(vote);
    });
    
    return groups;
  }

  public detectSuspiciousVotes(votes: CouncilVote[]): CouncilVote[] {
    // Simple implementation to detect suspicious votes
    return votes.filter(vote => vote.confidence > 0.95 || vote.confidence < 0.05);
  }
}
