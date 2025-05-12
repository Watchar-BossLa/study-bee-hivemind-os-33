
import { SpecializedAgent } from '../../types/agents';
import { CouncilVote } from '../../types/councils';
import { VoteHistoryStorage } from './VoteHistoryStorage';
import { VoteWeightCalculator } from './VoteWeightCalculator';
import { VoteAnalyzer } from './VoteAnalyzer';
import { ConsensusCalculator } from './ConsensusCalculator';
import { VoteIntegrityService } from './VoteIntegrityService';
import { VoteCollector } from './VoteCollector';
import { PlanVoter } from './PlanVoter';
import type { Plan, VotingOptions, VoteCollectionResult } from './types/votingTypes';

// Use 'export type' syntax for TypeScript isolated modules
export type { Plan, VotingOptions };

export class VotingService {
  private voteHistoryStorage: VoteHistoryStorage;
  private voteWeightCalculator: VoteWeightCalculator;
  private voteAnalyzer: VoteAnalyzer;
  private consensusCalculator: ConsensusCalculator;
  private voteIntegrityService: VoteIntegrityService;
  private voteCollector: VoteCollector;
  private planVoter: PlanVoter;

  constructor() {
    this.voteHistoryStorage = new VoteHistoryStorage();
    this.voteWeightCalculator = new VoteWeightCalculator();
    this.voteAnalyzer = new VoteAnalyzer();
    this.consensusCalculator = new ConsensusCalculator();
    this.voteIntegrityService = new VoteIntegrityService();
    this.voteCollector = new VoteCollector();
    this.planVoter = new PlanVoter();
  }

  // Add the missing methods needed by DeliberationProcessor
  public calculateConsensusScore(votes: CouncilVote[]): number {
    return this.voteAnalyzer.calculateConsensusScore(votes);
  }

  public getMajorityDecision(votes: CouncilVote[]): string | null {
    return this.voteAnalyzer.getMajorityDecision(votes);
  }

  public detectSuspiciousVotes(votes: CouncilVote[]): CouncilVote[] {
    return this.voteAnalyzer.detectSuspiciousVotes(votes);
  }

  public groupVotesBySuggestion(votes: CouncilVote[]): Map<string, CouncilVote[]> {
    return this.voteAnalyzer.groupVotesBySuggestion(votes);
  }

  public collectVotes(
    council: SpecializedAgent[], 
    topic: string,
    options?: VotingOptions
  ): CouncilVote[] {
    // Create votes from council members
    const votes: CouncilVote[] = council.map(agent => {
      return {
        agentId: agent.id,
        suggestion: `Simulated vote from ${agent.name}`,
        confidence: 0.8,
        reasoning: `Reasoning from ${agent.name}`
      };
    });

    // Identify suspicious votes using integrity service
    const suspiciousVotes = this.voteIntegrityService.identifySuspiciousVotes(votes, topic);

    // Calculate weights for each vote - FIX: don't pass vote as SpecializedAgent
    const weightedVotes = votes.map(vote => {
      // Find the corresponding agent for this vote
      const agent = council.find(a => a.id === vote.agentId);
      // Calculate weight using the agent or a default weight if agent not found
      const weight = agent 
        ? this.voteWeightCalculator.calculateWeight(agent, topic)
        : 1.0; // Default weight
      return { ...vote, weight };
    });

    // Calculate consensus using weighted votes
    const suggestionGroups = this.voteAnalyzer.groupVotesBySuggestion(votes);
    const { suggestion, confidence } = this.consensusCalculator.calculateConsensus(
      weightedVotes, 
      suggestionGroups,
      {
        baseThreshold: options?.baseThreshold || 0.6, 
        minRequiredVotes: options?.minRequiredVotes || 2
      }
    );

    // Store votes in history
    this.voteHistoryStorage.addVotes(votes, topic);

    return votes;
  }

  public collectVotesWithPlan(
    council: SpecializedAgent[],
    topic: string,
    plan: Plan,
    options?: VotingOptions
  ): CouncilVote[] {
    // Collect votes from council members regarding the plan
    const votes = this.voteCollector.collectVotesWithPlan(council, topic, plan, options);

    // Vote on the plan (assigns tasks if approved)
    votes.forEach(vote => {
      if (vote.confidence > 0.7) {
        this.planVoter.voteOnPlan(plan, vote.agentId, true, vote.reasoning);
      } else {
        this.planVoter.voteOnPlan(plan, vote.agentId, false, vote.reasoning);
      }
    });

    // Store votes in history
    this.voteHistoryStorage.addVotes(votes, topic);

    return votes;
  }

  public getRecentVotingTrends(): Map<string, { up: number; down: number }> {
    return this.planVoter.getLatestVoteTrends();
  }
}
