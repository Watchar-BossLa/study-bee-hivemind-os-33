
import { SpecializedAgent } from '../types/agents';
import { CouncilVote, CouncilDecision } from '../types/councils';

export class DeliberationService {
  private decisions: CouncilDecision[] = [];

  public async deliberate(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, any>,
    maxTurns: number = 3,
    consensusThreshold: number = 0.8
  ): Promise<CouncilDecision> {
    const votes: CouncilVote[] = council.map(agent => ({
      agentId: agent.id,
      confidence: Math.random() * 0.4 + 0.6,
      suggestion: `${agent.role}'s suggestion on ${topic}`,
      reasoning: `Based on ${agent.domain} expertise, ${agent.role} recommends...`
    }));

    const suggestionGroups: Map<string, CouncilVote[]> = new Map();
    votes.forEach(vote => {
      if (!suggestionGroups.has(vote.suggestion)) {
        suggestionGroups.set(vote.suggestion, []);
      }
      suggestionGroups.get(vote.suggestion)!.push(vote);
    });

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

    const consensusConfidence = consensusCount / votes.length;
    
    const decision: CouncilDecision = {
      topic,
      votes,
      consensus: consensusSuggestion,
      confidenceScore: consensusConfidence,
      timestamp: new Date()
    };

    this.decisions.push(decision);
    return decision;
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.decisions.slice(-limit);
  }
}
