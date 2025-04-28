
import { SpecializedAgent } from '../../types/agents';
import { CouncilVote } from '../../types/councils';

export class VotingService {
  public collectVotes(
    council: SpecializedAgent[],
    topic: string
  ): CouncilVote[] {
    return council.map(agent => ({
      agentId: agent.id,
      confidence: Math.random() * 0.4 + 0.6,
      suggestion: `${agent.role}'s suggestion on ${topic}`,
      reasoning: `Based on ${agent.domain} expertise, ${agent.role} recommends...`
    }));
  }

  public groupVotesBySuggestion(votes: CouncilVote[]): Map<string, CouncilVote[]> {
    const suggestionGroups: Map<string, CouncilVote[]> = new Map();
    votes.forEach(vote => {
      if (!suggestionGroups.has(vote.suggestion)) {
        suggestionGroups.set(vote.suggestion, []);
      }
      suggestionGroups.get(vote.suggestion)!.push(vote);
    });
    return suggestionGroups;
  }
}
