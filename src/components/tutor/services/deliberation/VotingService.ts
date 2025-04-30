import { SpecializedAgent } from '../../types/agents';
import { CouncilVote } from '../../types/councils';
import { Plan } from '../frameworks/CrewAIPlanner';

export class VotingService {
  public collectVotes(
    council: SpecializedAgent[],
    topic: string
  ): CouncilVote[] {
    return council.map(agent => {
      // Calculate confidence based on domain expertise match
      const expertiseMatch = this.calculateExpertiseMatch(agent.domain, topic);
      const confidence = 0.6 + (expertiseMatch * 0.4); // Base 0.6 + up to 0.4 based on expertise match
      
      return {
        agentId: agent.id,
        confidence,
        suggestion: this.generateSuggestion(agent, topic, expertiseMatch),
        reasoning: `Based on ${agent.domain} expertise, ${agent.role} recommends this approach because it aligns with ${this.getReasoningContext(agent.domain, topic)}`
      };
    });
  }

  public collectVotesWithPlan(
    council: SpecializedAgent[],
    topic: string,
    plan: Plan
  ): CouncilVote[] {
    return council.map(agent => {
      // Calculate confidence based on domain expertise match
      const expertiseMatch = this.calculateExpertiseMatch(agent.domain, topic);
      
      // Boost confidence for agents that have related tasks in the plan
      const isPlanContributor = plan.members.some(member => member.agentId === agent.id);
      const planBoost = isPlanContributor ? 0.15 : 0;
      
      const confidence = Math.min(0.6 + (expertiseMatch * 0.4) + planBoost, 0.98);
      
      return {
        agentId: agent.id,
        confidence,
        suggestion: this.generatePlanAwareSuggestion(agent, topic, plan, expertiseMatch),
        reasoning: `Based on ${agent.domain} expertise and role in plan "${plan.title}", ${agent.role} recommends this approach because it aligns with ${this.getReasoningContext(agent.domain, topic)}`
      };
    });
  }

  private generatePlanAwareSuggestion(
    agent: SpecializedAgent, 
    topic: string, 
    plan: Plan, 
    expertiseMatch: number
  ): string {
    // Check if agent is a member of the plan
    const isMember = plan.members.some(member => member.agentId === agent.id);
    
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

  private calculateExpertiseMatch(domain: string, topic: string): number {
    // Simple expertise matching algorithm
    const domainKeywords = domain.toLowerCase().split(/\s+/);
    const topicKeywords = topic.toLowerCase().split(/\s+/);
    
    let matches = 0;
    for (const dword of domainKeywords) {
      for (const tword of topicKeywords) {
        if (dword.includes(tword) || tword.includes(dword)) {
          matches++;
        }
      }
    }
    
    return Math.min(matches / Math.max(domainKeywords.length, 1), 1);
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
}
