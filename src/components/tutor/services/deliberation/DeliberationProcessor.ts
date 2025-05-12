
import { VotingService, VotingOptions } from './VotingService';
import { CouncilVote } from '../../types/councils';
import { SpecializedAgent } from '../../types/agents';
import { Plan } from './types/votingTypes';
import { ConsensusService } from './ConsensusService';

export class DeliberationProcessor {
  private votingService: VotingService;
  private consensusService: ConsensusService;
  private thoughtProcesses: Map<string, string[]>;
  
  constructor(votingService: VotingService, consensusService: ConsensusService) {
    this.votingService = votingService;
    this.consensusService = consensusService;
    this.thoughtProcesses = new Map<string, string[]>();
  }

  public recordThought(topic: string, thought: string): void {
    if (!this.thoughtProcesses.has(topic)) {
      this.thoughtProcesses.set(topic, []);
    }
    this.thoughtProcesses.get(topic)!.push(thought);
  }
  
  public getThoughts(topic: string): string[] {
    return this.thoughtProcesses.get(topic) || [];
  }

  public processDeliberation(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, any>,
    options?: VotingOptions
  ): { votes: CouncilVote[], suggestion: string | null, confidence: number, suspiciousVotes: CouncilVote[] } {
    // Record initial thought
    this.recordThought(topic, `Council of ${council.length} agents deliberating on: ${topic}`);
    
    // Collect votes from council
    const votes = this.votingService.collectVotes(council, topic, options);
    
    // Calculate consensus score
    const consensusScore = this.votingService.calculateConsensusScore(votes);
    this.recordThought(topic, `Consensus level: ${(consensusScore * 100).toFixed(2)}%`);
    
    // Get majority decision
    const decision = this.votingService.getMajorityDecision(votes);
    
    // Get suspicious votes
    const suspiciousVotes = this.votingService.detectSuspiciousVotes(votes);
    
    return {
      votes,
      suggestion: decision,
      confidence: consensusScore,
      suspiciousVotes
    };
  }
  
  public processDeliberationWithPlan(
    council: SpecializedAgent[],
    topic: string,
    plan: Plan,
    options?: VotingOptions
  ): { votes: CouncilVote[], suggestion: string | null, confidence: number, suspiciousVotes: CouncilVote[] } {
    this.recordThought(topic, `Council deliberating on ${topic} with plan ${plan.planId}`);
    
    // Collect votes considering the plan
    const votes = this.votingService.collectVotesWithPlan(council, topic, plan, options);
    
    // Calculate consensus
    const consensusScore = this.votingService.calculateConsensusScore(votes);
    const decision = this.votingService.getMajorityDecision(votes);
    
    // Get suspicious votes
    const suspiciousVotes = this.votingService.detectSuspiciousVotes(votes);
    
    return {
      votes,
      suggestion: decision,
      confidence: consensusScore,
      suspiciousVotes
    };
  }
  
  public async deliberateOnTopic(
    council: SpecializedAgent[],
    topic: string,
    options?: VotingOptions
  ): Promise<{ decision: string; confidence: number }> {
    // Record initial thought
    this.recordThought(topic, `Council of ${council.length} agents deliberating on: ${topic}`);
    
    // Collect votes from council
    const votes = this.votingService.collectVotes(council, topic, options);
    
    // Calculate consensus score
    const consensusScore = this.votingService.calculateConsensusScore(votes);
    this.recordThought(topic, `Consensus level: ${(consensusScore * 100).toFixed(2)}%`);
    
    // Get majority decision
    const decision = this.votingService.getMajorityDecision(votes) || 'No consensus reached';
    
    return {
      decision,
      confidence: consensusScore
    };
  }
  
  public async deliberateWithPlan(
    council: SpecializedAgent[],
    topic: string,
    plan: Plan,
    options?: VotingOptions
  ): Promise<{ decision: string; confidence: number; updatedPlan: Plan }> {
    this.recordThought(topic, `Council deliberating on ${topic} with plan ${plan.planId}`);
    
    // Collect votes considering the plan
    const votes = this.votingService.collectVotesWithPlan(council, topic, plan, options);
    
    // Calculate consensus
    const consensusScore = this.votingService.calculateConsensusScore(votes);
    const decision = this.votingService.getMajorityDecision(votes) || 'No consensus reached';
    
    // Update the plan based on deliberation outcome
    const updatedPlan: Plan = { ...plan };
    
    return {
      decision,
      confidence: consensusScore,
      updatedPlan
    };
  }
  
  public analyzeVotePatterns(votes: CouncilVote[]): Record<string, number> {
    const patterns: Record<string, number> = {};
    
    votes.forEach(vote => {
      const patternKey = `${vote.agentId}-${vote.suggestion}`;
      patterns[patternKey] = (patterns[patternKey] || 0) + 1;
    });
    
    return patterns;
  }
  
  public identifyDisagreements(votes: CouncilVote[]): CouncilVote[] {
    const groups = this.votingService.groupVotesBySuggestion(votes);
    let disagreements: CouncilVote[] = [];
    
    groups.forEach(voteList => {
      if (voteList.length > 1) {
        // Consider it a disagreement if there are multiple votes on the same topic
        disagreements = disagreements.concat(voteList);
      }
    });
    
    return disagreements;
  }
}
