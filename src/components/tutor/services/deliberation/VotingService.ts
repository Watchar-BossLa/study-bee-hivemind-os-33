
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

  public collectVotes(
    council: SpecializedAgent[], 
    topic: string,
    options?: VotingOptions
  ): VoteCollectionResult {
    // Fixed the type error by passing the agent instead of just the agentId
    const votes = council.map(agent => {
      return {
        agentId: agent.id,
        suggestion: `Simulated vote from ${agent.name}`,
        confidence: 0.8,
        reasoning: `Reasoning from ${agent.name}`
      };
    });

    // Identify suspicious votes using integrity service
    const suspiciousVotes = this.voteIntegrityService.identifySuspiciousVotes(votes, topic);

    // Calculate weights for each vote
    const weightedVotes = votes.map(vote => {
      const weight = this.voteWeightCalculator.calculateWeight(vote, council);
      return { ...vote, weight };
    });

    // Calculate consensus using weighted votes
    const { suggestion, confidence } = this.consensusCalculator.calculateConsensus(
      weightedVotes, 
      options?.baseThreshold || 0.6, 
      options?.minRequiredVotes || 2
    );

    // Store votes in history
    this.voteHistoryStorage.addVotes(votes, topic);

    return {
      votes,
      suggestion,
      confidence,
      suspiciousVotes
    };
  }

  public collectVotesWithPlan(
    council: SpecializedAgent[],
    topic: string,
    plan: Plan,
    options?: VotingOptions
  ): VoteCollectionResult {
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

    // Identify suspicious votes
    const suspiciousVotes = this.voteIntegrityService.identifySuspiciousVotes(votes, topic);

    // Calculate consensus
    const { suggestion, confidence } = this.consensusCalculator.calculateConsensus(
      votes,
      options?.baseThreshold || 0.6,
      options?.minRequiredVotes || 2
    );

    // Store votes in history
    this.voteHistoryStorage.addVotes(votes, topic);

    return {
      votes,
      suggestion,
      confidence,
      suspiciousVotes
    };
  }

  public getRecentVotingTrends(): Map<string, { up: number; down: number }> {
    return this.planVoter.getLatestVoteTrends();
  }
}
