
import { CouncilVote, CouncilDecision } from '../../types/councils';

export class ConsensusService {
  public calculateConsensus(
    votes: CouncilVote[],
    suggestionGroups: Map<string, CouncilVote[]>
  ): { suggestion: string; confidence: number } {
    let consensusSuggestion = "";
    let highestScore = 0;

    // Weight votes by confidence
    suggestionGroups.forEach((groupVotes, suggestion) => {
      // Calculate weighted score: count + sum of confidences
      const weightedScore = groupVotes.length + groupVotes.reduce((sum, vote) => sum + vote.confidence, 0);
      
      if (weightedScore > highestScore) {
        highestScore = weightedScore;
        consensusSuggestion = suggestion;
      }
    });

    // Calculate overall confidence based on proportion of votes and their confidences
    const totalVotesForConsensus = suggestionGroups.get(consensusSuggestion)?.length || 0;
    const confidenceSum = suggestionGroups.get(consensusSuggestion)?.reduce((sum, vote) => sum + vote.confidence, 0) || 0;
    const averageConfidence = confidenceSum / Math.max(totalVotesForConsensus, 1);
    
    // Final confidence is a combination of vote proportion and average confidence
    const confidence = (totalVotesForConsensus / votes.length) * 0.7 + averageConfidence * 0.3;

    return {
      suggestion: consensusSuggestion,
      confidence
    };
  }

  public createDecision(
    topic: string,
    votes: CouncilVote[],
    consensus: string,
    confidenceScore: number
  ): CouncilDecision {
    return {
      topic,
      votes,
      consensus,
      confidenceScore,
      timestamp: new Date()
    };
  }
}
