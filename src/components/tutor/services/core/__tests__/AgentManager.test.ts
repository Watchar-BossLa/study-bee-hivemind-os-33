
import { AgentManager } from '../AgentManager';
import { BrowserEventEmitter } from '../BrowserEventEmitter';
import { SpecializedAgent } from '../../../types/agents';

describe('AgentManager', () => {
  let agentManager: AgentManager;
  let emitter: BrowserEventEmitter;
  
  // Mock agent for testing
  const mockAgent: SpecializedAgent = {
    id: 'test-agent-1',
    name: 'Test Agent',
    role: 'Expert',
    status: 'idle',
    domain: 'Testing',
    capabilities: ['test'],
    performance: {
      accuracy: 0.9,
      responseTime: 0.8,
      userFeedback: 0.85
    },
    type: 'subject-expert',
    expertise: ['testing']
  };

  beforeEach(() => {
    emitter = new BrowserEventEmitter();
    jest.spyOn(emitter, 'emit');
    agentManager = new AgentManager(emitter);
  });

  it('should register an agent and emit agent:registered event', () => {
    agentManager.registerAgent(mockAgent);
    
    expect(emitter.emit).toHaveBeenCalledWith('agent:registered', mockAgent.id);
    
    const agent = agentManager.getAgent(mockAgent.id);
    expect(agent).toEqual(mockAgent);
    
    const status = agentManager.getAgentStatus(mockAgent.id);
    expect(status).toBe('idle');
    
    const quota = agentManager.getAgentQuota(mockAgent.id);
    expect(quota).toBeDefined();
    expect(quota?.currentUsage).toBe(0);
    expect(quota?.maxConcurrentTasks).toBeGreaterThan(0);
  });

  it('should get agent status', () => {
    agentManager.registerAgent(mockAgent);
    
    // Test getting status of existing agent
    let status = agentManager.getAgentStatus(mockAgent.id);
    expect(status).toBe('idle');
    
    // Test getting status of non-existent agent
    status = agentManager.getAgentStatus('non-existent-agent');
    expect(status).toBe('unknown');
  });

  it('should set agent status', () => {
    agentManager.registerAgent(mockAgent);
    
    // Set status for existing agent
    let result = agentManager.setAgentStatus(mockAgent.id, 'busy');
    expect(result).toBe(true);
    
    const status = agentManager.getAgentStatus(mockAgent.id);
    expect(status).toBe('busy');
    
    // Try to set status for non-existent agent
    result = agentManager.setAgentStatus('non-existent-agent', 'busy');
    expect(result).toBe(false);
  });

  it('should get agent metrics', () => {
    agentManager.registerAgent(mockAgent);
    
    // Initially, metrics should be undefined
    const initialMetrics = agentManager.getAgentMetrics(mockAgent.id);
    expect(initialMetrics).toBeUndefined();
    
    // Update metrics
    agentManager.updateTaskMetrics(mockAgent.id, true);
    
    const updatedMetrics = agentManager.getAgentMetrics(mockAgent.id);
    expect(updatedMetrics).toBeDefined();
    expect(updatedMetrics?.successRate).toBeGreaterThan(0);
  });

  it('should update agent quota', () => {
    agentManager.registerAgent(mockAgent);
    
    // Get initial quota
    const initialQuota = agentManager.getAgentQuota(mockAgent.id);
    expect(initialQuota?.currentUsage).toBe(0);
    
    // Update quota
    const result = agentManager.updateAgentQuota(mockAgent.id, (quota) => ({
      ...quota,
      currentUsage: quota.currentUsage + 1
    }));
    
    expect(result).toBe(true);
    
    // Check updated quota
    const updatedQuota = agentManager.getAgentQuota(mockAgent.id);
    expect(updatedQuota?.currentUsage).toBe(1);
    
    // Try to update non-existent agent quota
    const failedResult = agentManager.updateAgentQuota('non-existent-agent', (quota) => quota);
    expect(failedResult).toBe(false);
  });

  it('should update task metrics for success and failure', () => {
    agentManager.registerAgent(mockAgent);
    
    // Update metrics for successful task
    agentManager.updateTaskMetrics(mockAgent.id, true);
    let metrics = agentManager.getAgentMetrics(mockAgent.id);
    const successRate1 = metrics?.successRate;
    expect(successRate1).toBeGreaterThan(0);
    
    // Update metrics for failed task
    agentManager.updateTaskMetrics(mockAgent.id, false);
    metrics = agentManager.getAgentMetrics(mockAgent.id);
    const successRate2 = metrics?.successRate;
    
    // Success rate should decrease after failure
    expect(successRate2).toBeLessThan(successRate1!);
  });
});
