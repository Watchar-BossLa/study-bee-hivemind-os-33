
import { SpecializedAgent } from '../../types/agents';
import { CouncilVote } from '../../types/councils';
import { Plan } from '../frameworks/CrewAIPlanner';
import { VoteWeightCalculator } from './VoteWeightCalculator';
import { VoteIntegrityService } from './VoteIntegrityService';

export interface VotingOptions {
  timeLimit?: number; // ms
  complexityOverride?: 'low' | 'medium' | 'high';
  boostAgentIds?: string[]; // IDs of agents to boost
  boostFactor?: number; // How much to boost (0-1)
  minRequiredVotes?: number;
  usePerformanceHistory?: boolean;
}

export class VotingService {
  private weightCalculator: VoteWeightCalculator;
  private integrityService: VoteIntegrityService;
  
  constructor() {
    this.weightCalculator = new VoteWeightCalculator();
    this.integrityService = new VoteIntegrityService();
  }

  public collectVotes(
    council: SpecializedAgent[],
    topic: string,
    options?: VotingOptions
  ): CouncilVote[] {
    return council.map(agent => {
      // Calculate weight based on expertise, performance, and other factors
      const weight = this.weightCalculator.calculateWeight(agent, topic);
      
      // Apply boost if this agent is in the boost list
      const boost = this.calculateBoost(agent.id, options);
      const finalConfidence = Math.min(weight + boost, 0.98);
      
      const vote: CouncilVote = {
        agentId: agent.id,
        confidence: finalConfidence,
        suggestion: this.generateSuggestion(agent, topic, weight),
        reasoning: `Based on ${agent.domain} expertise, ${agent.role} recommends this approach because it aligns with ${this.getReasoningContext(agent.domain, topic)}`
      };
      
      // Secure the vote with a hash
      this.integrityService.secureVote(vote);
      
      return vote;
    });
  }

  public collectVotesWithPlan(
    council: SpecializedAgent[],
    topic: string,
    plan: Plan,
    options?: VotingOptions
  ): CouncilVote[] {
    return council.map(agent => {
      // Calculate baseline weight
      const weight = this.weightCalculator.calculateWeight(agent, topic);
      
      // Boost confidence for agents that have related tasks in the plan
      const isPlanContributor = plan.members.some(member => member.id === agent.id);
      const planBoost = isPlanContributor ? 0.15 : 0;
      
      // Apply user-requested boosts
      const userBoost = this.calculateBoost(agent.id, options);
      
      // Combine all confidence factors, capped at 0.98
      const finalConfidence = Math.min(weight + planBoost + userBoost, 0.98);
      
      const vote: CouncilVote = {
        agentId: agent.id,
        confidence: finalConfidence,
        suggestion: this.generatePlanAwareSuggestion(agent, topic, plan, weight),
        reasoning: `Based on ${agent.domain} expertise and role in plan "${plan.title}", ${agent.role} recommends this approach because it aligns with ${this.getReasoningContext(agent.domain, topic)}`
      };
      
      // Secure the vote with a hash
      this.integrityService.secureVote(vote);
      
      return vote;
    });
  }
  
  /**
   * Calculate boost value for an agent based on options
   */
  private calculateBoost(agentId: string, options?: VotingOptions): number {
    if (!options || !options.boostAgentIds || !options.boostAgentIds.includes(agentId)) {
      return 0;
    }
    
    return options.boostFactor || 0.2; // Default boost of 0.2 if not specified
  }

  private generatePlanAwareSuggestion(
    agent: SpecializedAgent, 
    topic: string, 
    plan: Plan, 
    expertiseMatch: number
  ): string {
    // Check if agent is a member of the plan
    const isMember = plan.members.some(member => member.id === agent.id);
    
    if (isMember) {
      // Get assigned tasks for this agent
      const memberTasks = plan.tasks.filter(task => 
        task.assignedTo.includes(agent.id)
      );
      
      if (memberTasks.length > 0) {
        return `Approach ${topic} according to plan "${plan.title}", focusing on: ${memberTasks[0].description}`;
      }
    }
    
    // Fall back to standard suggestion if not involved in specific tasks
    return this.generateSuggestion(agent, topic, expertiseMatch);
  }

  private generateSuggestion(agent: SpecializedAgent, topic: string, expertiseMatch: number): string {
    const suggestions = [
      `A ${agent.domain}-focused approach to ${topic}`,
      `${topic} should be addressed through ${agent.domain} principles`,
      `Incorporating ${agent.domain} methodologies into ${topic}`,
      `Applying ${agent.domain} frameworks to solve ${topic} challenges`
    ];

    // Return more specific suggestion for higher expertise match
    const index = Math.min(Math.floor(expertiseMatch * suggestions.length), suggestions.length - 1);
    return suggestions[index];
  }

  private getReasoningContext(domain: string, topic: string): string {
    const contexts = [
      `proven ${domain} best practices`,
      `research in the field of ${domain}`,
      `established ${domain} frameworks`,
      `recent advancements in ${domain} theory`
    ];
    
    return contexts[Math.floor(Math.random() * contexts.length)];
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
  
  /**
   * Find potentially manipulated votes
   */
  public detectSuspiciousVotes(votes: CouncilVote[]): CouncilVote[] {
    // First check vote integrity
    const tampered = votes.filter(vote => !this.integrityService.verifyVote(vote));
    
    // Then check for statistical outliers
    const outliers = this.integrityService.detectOutliers(votes);
    
    // Combine and deduplicate results
    const allSuspicious = [...tampered, ...outliers];
    return [...new Set(allSuspicious)];
  }
}
