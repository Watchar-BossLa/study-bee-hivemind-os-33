
import { CouncilVote, CouncilDecision } from '../../types/councils';

export class ConsensusService {
  public calculateConsensus(
    votes: CouncilVote[],
    suggestionGroups: Map<string, CouncilVote[]>
  ): { suggestion: string; confidence: number } {
    let consensusSuggestion = "";
    let consensusCount = 0;
    let highestCount = 0;

    suggestionGroups.forEach((groupVotes, suggestion) => {
      if (groupVotes.length > highestCount) {
        highestCount = groupVotes.length;
        consensusSuggestion = suggestion;
        consensusCount = groupVotes.length;
      }
    });

    return {
      suggestion: consensusSuggestion,
      confidence: consensusCount / votes.length
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
