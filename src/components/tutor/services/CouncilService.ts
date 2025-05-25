import { SpecializedAgent } from '../types/agents';
import { CouncilRepository } from './councils/CouncilRepository';
import { CouncilSelector } from './councils/CouncilSelector';
import { DynamicCouncilManager } from './councils/DynamicCouncilManager';
import { SwarmMetricsService, SwarmMetricsRecord, AgentPerformanceMetrics } from './metrics/SwarmMetricsService';

export interface QueryComplexity {
  level: 'simple' | 'moderate' | 'complex' | 'expert';
  domains: string[];
  requiredExpertise: string[];
  estimatedAgentCount: number;
}

export interface DynamicCouncilConfig {
  minAgents: number;
  maxAgents: number;
  diversityWeight: number;
  performanceWeight: number;
  availabilityWeight: number;
}

export class CouncilService {
  private councils: Map<string, SpecializedAgent[]>;
  private repository: CouncilRepository;
  private selector: CouncilSelector;
  private manager: DynamicCouncilManager;
  private swarmMetricsService: SwarmMetricsService;
  private dynamicCouncilConfig: DynamicCouncilConfig = {
    minAgents: 3,
    maxAgents: 7,
    diversityWeight: 0.4,
    performanceWeight: 0.4,
    availabilityWeight: 0.2
  };
  
  constructor() {
    this.repository = new CouncilRepository();
    this.selector = new CouncilSelector();
    this.manager = new DynamicCouncilManager();
    this.swarmMetricsService = new SwarmMetricsService();
    
    this.councils = this.repository.getAllCouncils();
    
    if (this.councils.size === 0 && arguments.length > 0) {
      const agents = arguments[0] as SpecializedAgent[];
      this.createDefaultCouncils(agents);
    } else {
      this.councils = new Map();
    }
  }
  
  private createDefaultCouncils(agents: SpecializedAgent[]) {
    const tutorAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('teaching') || e.includes('education'))
    );
    
    const securityAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('security'))
    );
    
    const reasoningAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('reasoning') || e.includes('logic'))
    );
    
    const codeAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('code') || e.includes('programming'))
    );
    
    if (tutorAgents.length >= 3) {
      this.councils.set('tutor', tutorAgents.slice(0, 5));
    }
    
    if (securityAgents.length >= 3) {
      this.councils.set('security', securityAgents.slice(0, 5));
    }
    
    if (reasoningAgents.length >= 3) {
      this.councils.set('reasoning', reasoningAgents.slice(0, 5));
    }
    
    if (codeAgents.length >= 3) {
      this.councils.set('code', codeAgents.slice(0, 5));
    }
    
    const generalAgents = this.selectDiverseAgents(agents, 5);
    if (generalAgents.length >= 3) {
      this.councils.set('general', generalAgents);
    }
  }
  
  private selectDiverseAgents(agents: SpecializedAgent[], count: number): SpecializedAgent[] {
    const selected: SpecializedAgent[] = [];
    const expertiseCovered = new Set<string>();
    
    const sortedAgents = [...agents].sort((a, b) => b.expertise.length - a.expertise.length);
    
    for (const agent of sortedAgents) {
      if (selected.length >= count) break;
      
      const newExpertise = agent.expertise.some(e => !expertiseCovered.has(e));
      if (newExpertise || selected.length < 3) {
        selected.push(agent);
        agent.expertise.forEach(e => expertiseCovered.add(e));
      }
    }
    
    return selected;
  }
  
  public analyzeQueryComplexity(query: string): QueryComplexity {
    const words = query.toLowerCase().split(/\s+/);
    const complexityIndicators = {
      simple: ['what', 'is', 'define', 'explain'],
      moderate: ['how', 'why', 'compare', 'analyze'],
      complex: ['evaluate', 'synthesize', 'design', 'create'],
      expert: ['optimize', 'architect', 'research', 'innovate']
    };

    let complexity: QueryComplexity['level'] = 'simple';
    let score = 0;

    Object.entries(complexityIndicators).forEach(([level, keywords]) => {
      const matches = keywords.filter(keyword => words.some(word => word.includes(keyword))).length;
      if (matches > 0) {
        const levelScore = matches * (level === 'expert' ? 4 : level === 'complex' ? 3 : level === 'moderate' ? 2 : 1);
        if (levelScore > score) {
          score = levelScore;
          complexity = level as QueryComplexity['level'];
        }
      }
    });

    const domains = this.extractDomains(query);
    const requiredExpertise = this.extractRequiredExpertise(query);
    
    return {
      level: complexity,
      domains,
      requiredExpertise,
      estimatedAgentCount: Math.min(
        this.dynamicCouncilConfig.minAgents + domains.length - 1,
        this.dynamicCouncilConfig.maxAgents
      )
    };
  }

  private extractDomains(query: string): string[] {
    const domainKeywords = {
      mathematics: ['math', 'algebra', 'geometry', 'calculus', 'statistics'],
      science: ['physics', 'chemistry', 'biology', 'science'],
      programming: ['code', 'programming', 'algorithm', 'software'],
      language: ['english', 'writing', 'literature', 'grammar']
    };

    const foundDomains: string[] = [];
    const queryLower = query.toLowerCase();

    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        foundDomains.push(domain);
      }
    });

    return foundDomains.length > 0 ? foundDomains : ['general'];
  }

  private extractRequiredExpertise(query: string): string[] {
    const expertiseKeywords = {
      'content expertise': ['explain', 'define', 'describe'],
      'problem solving': ['solve', 'find', 'calculate'],
      'assessment': ['evaluate', 'grade', 'test'],
      'strategy': ['plan', 'approach', 'method'],
      'creativity': ['create', 'design', 'invent']
    };

    const requiredExpertise: string[] = [];
    const queryLower = query.toLowerCase();

    Object.entries(expertiseKeywords).forEach(([expertise, keywords]) => {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        requiredExpertise.push(expertise);
      }
    });

    return requiredExpertise.length > 0 ? requiredExpertise : ['general knowledge'];
  }

  public formOptimalCouncil(
    query: string,
    availableAgents: SpecializedAgent[]
  ): { agents: SpecializedAgent[]; reasoning: string; councilId: string } {
    const complexity = this.analyzeQueryComplexity(query);
    const agentMetrics = this.swarmMetricsService.getAgentPerformanceMetrics();
    
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      score: this.calculateAgentScore(agent, complexity, agentMetrics)
    })).sort((a, b) => b.score - a.score);

    const targetCount = Math.max(
      this.dynamicCouncilConfig.minAgents,
      Math.min(complexity.estimatedAgentCount, this.dynamicCouncilConfig.maxAgents)
    );

    const selectedAgents = this.selectBalancedTeam(scoredAgents, targetCount, complexity);
    const councilId = this.manager.createDynamicCouncil(
      `${complexity.level}-${complexity.domains.join('-')}`,
      selectedAgents
    );

    const reasoning = `Formed ${complexity.level} council with ${selectedAgents.length} agents for domains: ${complexity.domains.join(', ')}. Selected based on expertise match (${Math.round(this.dynamicCouncilConfig.diversityWeight * 100)}%), performance (${Math.round(this.dynamicCouncilConfig.performanceWeight * 100)}%), and availability (${Math.round(this.dynamicCouncilConfig.availabilityWeight * 100)}%).`;

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
      expertiseScore * this.dynamicCouncilConfig.diversityWeight +
      performanceScore * this.dynamicCouncilConfig.performanceWeight +
      availabilityScore * this.dynamicCouncilConfig.availabilityWeight
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

    for (const { agent } of scoredAgents) {
      if (selected.length >= targetCount) break;
      if (!selected.includes(agent)) {
        selected.push(agent);
      }
    }

    return selected;
  }

  public getCouncil(id: string): SpecializedAgent[] | undefined {
    return this.councils.get(id);
  }
  
  public getAllCouncils(): Map<string, SpecializedAgent[]> {
    return new Map(this.councils);
  }
  
  public createCouncil(id: string, agents: SpecializedAgent[]): boolean {
    if (this.councils.has(id)) {
      return false;
    }
    
    this.councils.set(id, agents);
    return true;
  }
  
  public updateCouncil(id: string, agents: SpecializedAgent[]): boolean {
    if (!this.councils.has(id)) {
      return false;
    }
    
    this.councils.set(id, agents);
    return true;
  }
  
  public deleteCouncil(id: string): boolean {
    return this.councils.delete(id);
  }
  
  public determineCouncilForMessage(message: string): string {
    return this.selector.selectCouncilForMessage(message, Array.from(this.councils.keys()));
  }
  
  public createDynamicCouncil(topic: string, agents: SpecializedAgent[]): string {
    return this.manager.createDynamicCouncil(topic, agents);
  }
  
  public recordSwarmMetrics(metrics: SwarmMetricsRecord): void {
    this.swarmMetricsService.recordMetrics(metrics);
  }
  
  public getSwarmMetrics(count: number = 10): SwarmMetricsRecord[] {
    return this.swarmMetricsService.getRecentMetrics(count);
  }
  
  public getAggregatedSwarmMetrics(
    period: 'hour' | 'day' | 'week' = 'day',
    limit: number = 7
  ) {
    return this.swarmMetricsService.getAggregatedMetrics(period, limit);
  }

  public getAgentPerformanceMetrics(): AgentPerformanceMetrics[] {
    return this.swarmMetricsService.getAgentPerformanceMetrics();
  }
}
