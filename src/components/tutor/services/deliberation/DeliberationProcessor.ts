
import { SpecializedAgent } from '../../types/agents';
import { CouncilDecision, CouncilVote } from '../../types/councils';
import { VotingService, VotingOptions } from './VotingService';
import { ConsensusService, ConsensusOptions } from './ConsensusService';
import { Plan } from '../frameworks/CrewAIPlanner';

export class DeliberationProcessor {
  private votingService: VotingService;
  private consensusService: ConsensusService;

  constructor(
    votingService: VotingService,
    consensusService: ConsensusService
  ) {
    this.votingService = votingService;
    this.consensusService = consensusService;
  }

  /**
   * Process standard deliberation
   */
  public processDeliberation(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, any>,
    options?: VotingOptions & ConsensusOptions
  ): {
    votes: CouncilVote[],
    suggestion: string,
    confidence: number,
    suspiciousVotes: CouncilVote[]
  } {
    // Get votes from agents
    const votes = this.votingService.collectVotes(council, topic, options);
    const suggestionGroups = this.votingService.groupVotesBySuggestion(votes);
    
    // Check for suspicious votes
    const suspiciousVotes = this.votingService.detectSuspiciousVotes(votes);
    
    // Convert deliberation options to consensus options
    const consensusOptions: ConsensusOptions = {
      baseThreshold: options?.baseThreshold || 0.7,
      minRequiredVotes: options?.minRequiredVotes,
      timeoutMs: options?.timeLimit,
      topicComplexity: options?.complexityOverride
    };
    
    // Calculate consensus
    const { suggestion, confidence } = this.consensusService.calculateConsensus(
      votes,
      suggestionGroups,
      consensusOptions
    );

    return {
      votes,
      suggestion,
      confidence,
      suspiciousVotes
    };
  }

  /**
   * Process deliberation with a plan
   */
  public processDeliberationWithPlan(
    council: SpecializedAgent[],
    topic: string,
    plan: Plan,
    options?: VotingOptions & ConsensusOptions
  ): {
    votes: CouncilVote[],
    suggestion: string,
    confidence: number,
    suspiciousVotes: CouncilVote[]
  } {
    // Use the plan tasks to guide voting process
    const votes = this.votingService.collectVotesWithPlan(
      council, 
      topic, 
      plan,
      options
    );
    
    const suggestionGroups = this.votingService.groupVotesBySuggestion(votes);
    
    // Check for suspicious votes
    const suspiciousVotes = this.votingService.detectSuspiciousVotes(votes);
    
    // Convert deliberation options to consensus options
    const consensusOptions: ConsensusOptions = {
      baseThreshold: options?.baseThreshold || 0.65, // Lower threshold for plan-based decisions
      minRequiredVotes: options?.minRequiredVotes,
      timeoutMs: options?.timeLimit,
      topicComplexity: 'high' // Plans are considered complex
    };
    
    const { suggestion, confidence } = this.consensusService.calculateConsensus(
      votes,
      suggestionGroups,
      consensusOptions
    );

    return {
      votes,
      suggestion,
      confidence,
      suspiciousVotes
    };
  }
}
