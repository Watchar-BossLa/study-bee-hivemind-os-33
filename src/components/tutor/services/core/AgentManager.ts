
import { BrowserEventEmitter } from './BrowserEventEmitter';
import { SpecializedAgent } from '../../types/agents';
import { AgentMetrics, AgentQuota } from '../../types/mcp';

export class AgentManager {
  private agentRegistry: Map<string, SpecializedAgent> = new Map();
  private agentStatus: Map<string, 'idle' | 'busy' | 'error'> = new Map();
  private taskPerformanceMetrics: Map<string, AgentMetrics> = new Map();
  private resourceQuotas: Map<string, AgentQuota> = new Map();
  private emitter: BrowserEventEmitter;
  
  constructor(emitter: BrowserEventEmitter) {
    this.emitter = emitter;
  }
  
  public registerAgent(agent: SpecializedAgent): void {
    this.agentRegistry.set(agent.id, agent);
    this.agentStatus.set(agent.id, 'idle');
    this.resourceQuotas.set(agent.id, { 
      maxConcurrentTasks: this.determineMaxConcurrentTasks(agent),
      currentUsage: 0
    });
    
    console.log(`Agent ${agent.name} (${agent.id}) registered with MCP-Core`);
    this.emitter.emit('agent:registered', agent.id);
  }
  
  public getAgent(agentId: string): SpecializedAgent | undefined {
    return this.agentRegistry.get(agentId);
  }
  
  public getAgentStatus(agentId: string): 'idle' | 'busy' | 'error' | 'unknown' {
    return this.agentStatus.get(agentId) || 'unknown';
  }
  
  public setAgentStatus(agentId: string, status: 'idle' | 'busy' | 'error'): boolean {
    if (!this.agentRegistry.has(agentId)) {
      return false;
    }
    
    this.agentStatus.set(agentId, status);
    return true;
  }
  
  public getAgentMetrics(agentId: string): AgentMetrics | undefined {
    return this.taskPerformanceMetrics.get(agentId);
  }
  
  public getAgentQuota(agentId: string): AgentQuota | undefined {
    return this.resourceQuotas.get(agentId);
  }
  
  public updateAgentQuota(agentId: string, updateFn: (quota: AgentQuota) => AgentQuota): boolean {
    const quota = this.resourceQuotas.get(agentId);
    
    if (!quota) {
      return false;
    }
    
    this.resourceQuotas.set(agentId, updateFn(quota));
    return true;
  }
  
  public updateTaskMetrics(agentId: string, success: boolean): void {
    const currentMetrics = this.taskPerformanceMetrics.get(agentId) || { 
      avgProcessingTime: 0, 
      successRate: 0 
    };
    
    // Simple update - in a real implementation we'd track more sophisticated metrics
    const newSuccessRate = success 
      ? (currentMetrics.successRate * 0.9) + 0.1  // Weighted towards success
      : (currentMetrics.successRate * 0.9);       // Decrease on failure
      
    this.taskPerformanceMetrics.set(agentId, {
      ...currentMetrics,
      successRate: newSuccessRate
    });
  }
  
  private determineMaxConcurrentTasks(agent: SpecializedAgent): number {
    // Simple algorithm based on agent performance
    const baseCapacity = 3;
    const performanceMultiplier = (agent.performance.accuracy + 1) / 2; // 0.5 to 1.0
    return Math.max(1, Math.round(baseCapacity * performanceMultiplier));
  }
}
