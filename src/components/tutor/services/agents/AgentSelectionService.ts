
import { SpecializedAgent } from '../../types/agents';
import { baseSpecializedAgents } from './BaseAgents';
import { domainSpecializedAgents } from './DomainAgents';
import { metaLearningAgents } from './MetaLearningAgents';

export class AgentSelectionService {
  private allAgents: SpecializedAgent[];

  constructor() {
    this.allAgents = [
      ...baseSpecializedAgents,
      ...domainSpecializedAgents,
      ...metaLearningAgents
    ];
  }

  /**
   * Get agents by domain
   */
  public getAgentsByDomain(domain: string): SpecializedAgent[] {
    return this.allAgents.filter(agent => 
      agent.domain.toLowerCase() === domain.toLowerCase() || 
      agent.expertise.some(exp => exp.toLowerCase().includes(domain.toLowerCase()))
    );
  }

  /**
   * Get the most suitable agents for a specific topic
   */
  public getAgentsForTopic(topic: string, count: number = 3): SpecializedAgent[] {
    const scoredAgents = this.allAgents.map(agent => {
      let score = 0;
      
      // Check if the agent has direct expertise in the topic
      const hasDirectExpertise = agent.expertise.some(exp => 
        topic.toLowerCase().includes(exp.toLowerCase()) || 
        exp.toLowerCase().includes(topic.toLowerCase())
      );
      
      if (hasDirectExpertise) score += 5;
      
      // Consider domain relevance
      if (topic.toLowerCase().includes(agent.domain.toLowerCase()) ||
          agent.domain.toLowerCase().includes(topic.toLowerCase())) {
        score += 3;
      }
      
      // Consider agent adaptability for topics outside their direct expertise
      if (!hasDirectExpertise) {
        score += (agent.adaptability || 0.5) * 2;
      }
      
      // Consider specialized depth for complex topics
      score += (agent.specializationDepth || 0.5) * 2;
      
      return { agent, score };
    });
    
    // Sort by score and take the top 'count' agents
    return scoredAgents
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.agent);
  }

  /**
   * Get all agents
   */
  public getAllAgents(): SpecializedAgent[] {
    return [...this.allAgents];
  }

  /**
   * Get agent by ID
   */
  public getAgentById(id: string): SpecializedAgent | undefined {
    return this.allAgents.find(agent => agent.id === id);
  }

  /**
   * Filter agents by capabilities
   */
  public getAgentsByCapabilities(capabilities: string[]): SpecializedAgent[] {
    return this.allAgents.filter(agent =>
      capabilities.some(capability =>
        agent.capabilities.includes(capability)
      )
    );
  }

  /**
   * Get agents by status
   */
  public getAgentsByStatus(status: string): SpecializedAgent[] {
    return this.allAgents.filter(agent => agent.status === status);
  }
}
