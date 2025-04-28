
import { BaseAgent, SpecializedAgent, AgentPerformanceMetrics } from '../types/agents';

export class AgentService {
  private agents: SpecializedAgent[];
  private agentPerformance: Map<string, AgentPerformanceMetrics> = new Map();
  private agentCollaborations: Map<string, Map<string, number>> = new Map();

  constructor(agents: SpecializedAgent[]) {
    this.agents = agents;
    this.initializePerformanceMetrics();
  }

  private initializePerformanceMetrics(): void {
    this.agents.forEach(agent => {
      this.agentPerformance.set(agent.id, {
        overallAccuracy: agent.performance.accuracy,
        userFeedbackAverage: agent.performance.userFeedback,
        responseTimeAverage: agent.performance.responseTime,
        domainSpecificPerformance: {},
        topicPerformance: {},
        improvementRate: 0,
        lastUpdated: new Date()
      });
      
      // Initialize collaboration map for each agent
      this.agentCollaborations.set(agent.id, new Map());
    });
  }

  public getAgents(): SpecializedAgent[] {
    return this.agents;
  }

  public getAgentById(id: string): SpecializedAgent | undefined {
    return this.agents.find(agent => agent.id === id);
  }

  public updateAgentStatus(agentId: string, status: 'idle' | 'busy' | 'error'): void {
    const agent = this.getAgentById(agentId);
    if (agent) {
      agent.status = status;
    }
  }

  public getAvailableAgents(): SpecializedAgent[] {
    return this.agents.filter(agent => agent.status === 'idle');
  }
  
  public getAgentsByDomain(domain: string): SpecializedAgent[] {
    return this.agents.filter(agent => 
      agent.domain.toLowerCase() === domain.toLowerCase() ||
      agent.expertise.some(exp => exp.toLowerCase().includes(domain.toLowerCase()))
    );
  }
  
  public getAgentsByExpertise(expertise: string): SpecializedAgent[] {
    return this.agents.filter(agent => 
      agent.expertise.some(exp => 
        exp.toLowerCase().includes(expertise.toLowerCase()) ||
        expertise.toLowerCase().includes(exp.toLowerCase())
      )
    );
  }
  
  public updateAgentPerformance(
    agentId: string, 
    metrics: Partial<AgentPerformanceMetrics>
  ): void {
    const agent = this.getAgentById(agentId);
    if (!agent) return;
    
    const currentMetrics = this.agentPerformance.get(agentId);
    if (!currentMetrics) return;
    
    this.agentPerformance.set(agentId, {
      ...currentMetrics,
      ...metrics,
      lastUpdated: new Date()
    });
    
    // Update the agent's performance stats
    if (metrics.overallAccuracy !== undefined) {
      agent.performance.accuracy = metrics.overallAccuracy;
    }
    
    if (metrics.userFeedbackAverage !== undefined) {
      agent.performance.userFeedback = metrics.userFeedbackAverage;
    }
    
    if (metrics.responseTimeAverage !== undefined) {
      agent.performance.responseTime = metrics.responseTimeAverage;
    }
  }
  
  public recordAgentCollaboration(
    primaryAgentId: string,
    secondaryAgentId: string,
    successScore: number // 0-1 indicating how successful the collaboration was
  ): void {
    // Get collaboration map for primary agent
    const primaryCollabs = this.agentCollaborations.get(primaryAgentId);
    if (!primaryCollabs) return;
    
    // Update collaboration score (average with previous if exists)
    const currentScore = primaryCollabs.get(secondaryAgentId) || 0.5;
    const newScore = (currentScore + successScore) / 2;
    primaryCollabs.set(secondaryAgentId, newScore);
    
    // Also update the secondary agent's collaboration with primary
    const secondaryCollabs = this.agentCollaborations.get(secondaryAgentId);
    if (secondaryCollabs) {
      const currentSecondaryScore = secondaryCollabs.get(primaryAgentId) || 0.5;
      const newSecondaryScore = (currentSecondaryScore + successScore) / 2;
      secondaryCollabs.set(primaryAgentId, newSecondaryScore);
    }
    
    // Update collaboration score on agent object if it exists
    const primaryAgent = this.getAgentById(primaryAgentId);
    const secondaryAgent = this.getAgentById(secondaryAgentId);
    
    if (primaryAgent && primaryAgent.collaborationScore !== undefined) {
      // Calculate average of all collaboration scores
      const allScores = Array.from(primaryCollabs.values());
      const avgScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
      primaryAgent.collaborationScore = avgScore;
    }
    
    if (secondaryAgent && secondaryAgent.collaborationScore !== undefined) {
      const allScores = Array.from(
        (this.agentCollaborations.get(secondaryAgentId) || new Map()).values()
      );
      const avgScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
      secondaryAgent.collaborationScore = avgScore;
    }
  }
  
  public getBestCollaboratorsForAgent(agentId: string, limit: number = 3): string[] {
    const collabs = this.agentCollaborations.get(agentId);
    if (!collabs || collabs.size === 0) return [];
    
    return Array.from(collabs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([collaboratorId, _]) => collaboratorId);
  }
  
  public getAgentPerformance(agentId: string): AgentPerformanceMetrics | undefined {
    return this.agentPerformance.get(agentId);
  }
  
  public getAllAgentPerformanceMetrics(): Map<string, AgentPerformanceMetrics> {
    return new Map(this.agentPerformance);
  }
}
