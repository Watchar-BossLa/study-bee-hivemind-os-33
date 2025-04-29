
import { SpecializedAgent } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { VotingService } from './deliberation/VotingService';
import { ConsensusService } from './deliberation/ConsensusService';
import { Plan } from './frameworks/CrewAIPlanner';

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
  
  public async deliberateWithPlan(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, any>,
    plan: Plan,
    maxTurns: number = 3,
    consensusThreshold: number = 0.8
  ): Promise<CouncilDecision> {
    console.log(`Deliberating with CrewAI plan: ${plan.title}`);
    
    // Use the plan tasks to guide voting process
    const enhancedVotes = this.votingService.collectVotesWithPlan(council, topic, plan);
    const suggestionGroups = this.votingService.groupVotesBySuggestion(enhancedVotes);
    
    const { suggestion, confidence } = this.consensusService.calculateConsensus(
      enhancedVotes,
      suggestionGroups
    );
    
    const decision = this.consensusService.createDecision(
      topic,
      enhancedVotes,
      suggestion,
      confidence
    );
    
    // Add plan metadata to the decision
    decision.plan = {
      id: plan.id,
      title: plan.title,
      taskCount: plan.tasks.length,
      memberCount: plan.members.length
    };

    this.decisions.push(decision);
    return decision;
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.decisions.slice(-limit);
  }
}
