
import { SpecializedAgent } from '../types/agents';
import { CouncilRepository } from './councils/CouncilRepository';
import { CouncilSelector } from './councils/CouncilSelector';
import { DynamicCouncilManager } from './councils/DynamicCouncilManager';
import { SwarmMetricsService, SwarmMetricsRecord } from './metrics/SwarmMetricsService';

export class CouncilService {
  private councils: Map<string, SpecializedAgent[]>;
  private repository: CouncilRepository;
  private selector: CouncilSelector;
  private manager: DynamicCouncilManager;
  private swarmMetricsService: SwarmMetricsService;
  
  constructor(agents: SpecializedAgent[]) {
    this.repository = new CouncilRepository();
    this.selector = new CouncilSelector();
    this.manager = new DynamicCouncilManager();
    this.swarmMetricsService = new SwarmMetricsService();
    
    // Initialize councils from repository or create defaults
    this.councils = this.repository.getAvailableCouncils();
    
    if (this.councils.size === 0) {
      // If no councils in repository, create defaults from agents
      this.createDefaultCouncils(agents);
    }
  }
  
  private createDefaultCouncils(agents: SpecializedAgent[]) {
    // Group agents by expertise to create default councils
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
    
    // Create councils with at least 3 agents
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
    
    // Create a general council with diverse expertise
    const generalAgents = this.selectDiverseAgents(agents, 5);
    if (generalAgents.length >= 3) {
      this.councils.set('general', generalAgents);
    }
  }
  
  private selectDiverseAgents(agents: SpecializedAgent[], count: number): SpecializedAgent[] {
    // Simple algorithm to select agents with diverse expertise
    const selected: SpecializedAgent[] = [];
    const expertiseCovered = new Set<string>();
    
    // Sort agents by the number of unique expertise areas they have
    const sortedAgents = [...agents].sort((a, b) => b.expertise.length - a.expertise.length);
    
    for (const agent of sortedAgents) {
      if (selected.length >= count) break;
      
      // Check if agent adds new expertise
      const newExpertise = agent.expertise.some(e => !expertiseCovered.has(e));
      if (newExpertise || selected.length < 3) {
        selected.push(agent);
        agent.expertise.forEach(e => expertiseCovered.add(e));
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
      return false; // Council already exists
    }
    
    this.councils.set(id, agents);
    return true;
  }
  
  public updateCouncil(id: string, agents: SpecializedAgent[]): boolean {
    if (!this.councils.has(id)) {
      return false; // Council doesn't exist
    }
    
    this.councils.set(id, agents);
    return true;
  }
  
  public deleteCouncil(id: string): boolean {
    return this.councils.delete(id);
  }
  
  public determineCouncilForMessage(message: string): string {
    return this.selector.selectCouncilForMessage(message, this.councils);
  }
  
  public createDynamicCouncil(topic: string, agents: SpecializedAgent[]): string {
    return this.manager.createDynamicCouncil(topic, agents, this.councils);
  }
  
  /**
   * Record swarm metrics from a swarm execution
   */
  public recordSwarmMetrics(metrics: SwarmMetricsRecord): void {
    this.swarmMetricsService.recordMetrics(metrics);
  }
  
  /**
   * Get recent swarm metrics
   */
  public getSwarmMetrics(count: number = 10): SwarmMetricsRecord[] {
    return this.swarmMetricsService.getRecentMetrics(count);
  }
  
  /**
   * Get aggregated swarm metrics
   */
  public getAggregatedSwarmMetrics(
    period: 'hour' | 'day' | 'week' = 'day',
    limit: number = 7
  ) {
    return this.swarmMetricsService.getAggregatedMetrics(period, limit);
  }
}
