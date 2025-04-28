
import { SpecializedAgent } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { VotingService } from './deliberation/VotingService';
import { ConsensusService } from './deliberation/ConsensusService';

export class DeliberationService {
  private decisions: CouncilDecision[] = [];
  private votingService: VotingService;
  private consensusService: ConsensusService;

  constructor() {
    this.votingService = new VotingService();
    this.consensusService = new ConsensusService();
  }

  public async deliberate(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, any>,
    maxTurns: number = 3,
    consensusThreshold: number = 0.8
  ): Promise<CouncilDecision> {
    const votes = this.votingService.collectVotes(council, topic);
    const suggestionGroups = this.votingService.groupVotesBySuggestion(votes);
    
    const { suggestion, confidence } = this.consensusService.calculateConsensus(
      votes,
      suggestionGroups
    );
    
    const decision = this.consensusService.createDecision(
      topic,
      votes,
      suggestion,
      confidence
    );

    this.decisions.push(decision);
    return decision;
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.decisions.slice(-limit);
  }
}
