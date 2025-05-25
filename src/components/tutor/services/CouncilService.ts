
import { SpecializedAgent } from '../types/agents';
import { SwarmMetricsService, SwarmMetricsRecord, AgentPerformanceMetrics } from './metrics/SwarmMetricsService';
import { CouncilQueryAnalyzer, QueryComplexity } from './councils/CouncilQueryAnalyzer';
import { CouncilFormationService } from './councils/CouncilFormationService';
import { CouncilManagementService } from './councils/CouncilManagementService';

export type { QueryComplexity };

export class CouncilService {
  private queryAnalyzer: CouncilQueryAnalyzer;
  private formationService: CouncilFormationService;
  private managementService: CouncilManagementService;
  private swarmMetricsService: SwarmMetricsService;
  
  constructor() {
    this.queryAnalyzer = new CouncilQueryAnalyzer();
    this.formationService = new CouncilFormationService();
    this.managementService = new CouncilManagementService();
    this.swarmMetricsService = new SwarmMetricsService();
    
    // Initialize with default councils if agents are provided
    if (arguments.length > 0) {
      const agents = arguments[0] as SpecializedAgent[];
      this.managementService.createDefaultCouncils(agents);
    }
  }
  
  public analyzeQueryComplexity(query: string): QueryComplexity {
    return this.queryAnalyzer.analyzeQueryComplexity(query);
  }

  public formOptimalCouncil(
    query: string,
    availableAgents: SpecializedAgent[]
  ): { agents: SpecializedAgent[]; reasoning: string; councilId: string } {
    const complexity = this.queryAnalyzer.analyzeQueryComplexity(query);
    const agentMetrics = this.swarmMetricsService.getAgentPerformanceMetrics();
    
    return this.formationService.formOptimalCouncil(
      query,
      complexity,
      availableAgents,
      agentMetrics
    );
  }

  public getCouncil(id: string): SpecializedAgent[] | undefined {
    return this.managementService.getCouncil(id);
  }
  
  public getAllCouncils(): Map<string, SpecializedAgent[]> {
    return this.managementService.getAllCouncils();
  }
  
  public createCouncil(id: string, agents: SpecializedAgent[]): boolean {
    return this.managementService.createCouncil(id, agents);
  }
  
  public updateCouncil(id: string, agents: SpecializedAgent[]): boolean {
    return this.managementService.updateCouncil(id, agents);
  }
  
  public deleteCouncil(id: string): boolean {
    return this.managementService.deleteCouncil(id);
  }
  
  public determineCouncilForMessage(message: string): string {
    return this.managementService.determineCouncilForMessage(message);
  }
  
  public createDynamicCouncil(topic: string, agents: SpecializedAgent[]): string {
    return this.formationService.createDynamicCouncil(topic, agents);
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
