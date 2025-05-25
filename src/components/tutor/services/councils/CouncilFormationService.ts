
import { SpecializedAgent } from '../../types/agents';
import { QueryComplexity } from './CouncilQueryAnalyzer';
import { AgentPerformanceMetrics } from '../metrics/SwarmMetricsService';
import { DynamicCouncilManager } from './DynamicCouncilManager';

export interface DynamicCouncilConfig {
  minAgents: number;
  maxAgents: number;
  diversityWeight: number;
  performanceWeight: number;
  availabilityWeight: number;
}

export class CouncilFormationService {
  private manager: DynamicCouncilManager;
  private config: DynamicCouncilConfig = {
    minAgents: 3,
    maxAgents: 7,
    diversityWeight: 0.4,
    performanceWeight: 0.4,
    availabilityWeight: 0.2
  };

  constructor() {
    this.manager = new DynamicCouncilManager();
  }

  public formOptimalCouncil(
    query: string,
    complexity: QueryComplexity,
    availableAgents: SpecializedAgent[],
    agentMetrics: AgentPerformanceMetrics[]
  ): { agents: SpecializedAgent[]; reasoning: string; councilId: string } {
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      score: this.calculateAgentScore(agent, complexity, agentMetrics)
    })).sort((a, b) => b.score - a.score);

    const targetCount = Math.max(
      this.config.minAgents,
      Math.min(complexity.estimatedAgentCount, this.config.maxAgents)
    );

    const selectedAgents = this.selectBalancedTeam(scoredAgents, targetCount, complexity);
    const councilId = this.manager.createDynamicCouncil(
      `${complexity.level}-${complexity.domains.join('-')}`,
      selectedAgents
    );

    const reasoning = `Formed ${complexity.level} council with ${selectedAgents.length} agents for domains: ${complexity.domains.join(', ')}. Selected based on expertise match (${Math.round(this.config.diversityWeight * 100)}%), performance (${Math.round(this.config.performanceWeight * 100)}%), and availability (${Math.round(this.config.availabilityWeight * 100)}%).`;

    return {
      agents: selectedAgents,
      reasoning,
      councilId
    };
  }

  private calculateAgentScore(
    agent: SpecializedAgent,
    complexity: QueryComplexity,
    metrics: AgentPerformanceMetrics[]
  ): number {
    const agentMetric = metrics.find(m => m.agentId === agent.id);
    
    const expertiseScore = this.calculateExpertiseRelevance(agent, complexity);
    
    const performanceScore = agentMetric ? 
      (agentMetric.successfulTasks / Math.max(agentMetric.totalTasks, 1)) : 0.5;
    
    const availabilityScore = agent.status === 'active' ? 1 : 
                             agent.status === 'idle' ? 0.8 : 0.3;

    return (
      expertiseScore * this.config.diversityWeight +
      performanceScore * this.config.performanceWeight +
      availabilityScore * this.config.availabilityWeight
    );
  }

  private calculateExpertiseRelevance(agent: SpecializedAgent, complexity: QueryComplexity): number {
    let relevanceScore = 0;
    
    complexity.domains.forEach(domain => {
      if (agent.domain.toLowerCase().includes(domain) || 
          agent.expertise.some(exp => exp.toLowerCase().includes(domain))) {
        relevanceScore += 0.8;
      }
    });

    complexity.requiredExpertise.forEach(expertise => {
      if (agent.expertise.some(exp => exp.toLowerCase().includes(expertise.toLowerCase()))) {
        relevanceScore += 0.6;
      }
    });

    return Math.min(relevanceScore, 1);
  }

  private selectBalancedTeam(
    scoredAgents: { agent: SpecializedAgent; score: number }[],
    targetCount: number,
    complexity: QueryComplexity
  ): SpecializedAgent[] {
    const selected: SpecializedAgent[] = [];
    const usedDomains = new Set<string>();
    
    // First, ensure we have coverage for each domain
    complexity.domains.forEach(domain => {
      const domainAgent = scoredAgents.find(({ agent }) => 
        !selected.includes(agent) && 
        (agent.domain.toLowerCase().includes(domain) ||
         agent.expertise.some(exp => exp.toLowerCase().includes(domain)))
      );
      
      if (domainAgent && selected.length < targetCount) {
        selected.push(domainAgent.agent);
        usedDomains.add(domain);
      }
    });

    // Then fill remaining slots with highest scoring agents
    for (const { agent } of scoredAgents) {
      if (selected.length >= targetCount) break;
      if (!selected.includes(agent)) {
        selected.push(agent);
      }
    }

    return selected;
  }

  public createDynamicCouncil(topic: string, agents: SpecializedAgent[]): string {
    return this.manager.createDynamicCouncil(topic, agents);
  }
}
