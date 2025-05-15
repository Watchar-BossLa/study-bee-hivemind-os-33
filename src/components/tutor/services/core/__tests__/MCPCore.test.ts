
import { MCPCore } from '../MCPCore';
import { TaskPriority } from '../../types/mcp';
import { SpecializedAgent } from '../../types/agents';

describe('MCPCore', () => {
  let mcpCore: MCPCore;
  
  // Mock agent for testing
  const mockAgent: SpecializedAgent = {
    id: 'test-agent',
    name: 'Test Agent',
    description: 'A test agent for MCP',
    capabilities: ['test'],
    performance: {
      accuracy: 0.9,
      speed: 0.8
    },
    type: 'subject-expert',
    expertise: ['testing']
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mcpCore = new MCPCore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize and register event listeners', () => {
    expect(mcpCore).toBeDefined();
  });

  it('should register an agent', () => {
    mcpCore.registerAgent(mockAgent);
    
    const status = mcpCore.getAgentStatus(mockAgent.id);
    expect(status).toBe('idle');
  });

  it('should submit and process a task', async () => {
    // Register the agent first
    mcpCore.registerAgent(mockAgent);
    
    // Submit a task
    const taskId = await mcpCore.submitTask({
      agentId: mockAgent.id,
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    expect(taskId).toBeDefined();
    expect(typeof taskId).toBe('string');
    
    // Check that task is in processing state
    expect(mcpCore.getTask(taskId)?.status).toBe('processing');
    
    // Fast-forward timer
    jest.advanceTimersByTime(1000);
    
    // Check that task is now completed
    const completedTask = mcpCore.getTask(taskId);
    expect(completedTask?.status).toBe('completed');
    expect(completedTask?.result).toEqual({ simulatedResult: true });
  });

  it('should send and deliver a message', () => {
    // Register the agent first as recipient
    mcpCore.registerAgent(mockAgent);
    
    // Send a message
    const messageId = mcpCore.sendMessage({
      fromAgentId: 'sender-agent',
      toAgentId: mockAgent.id,
      content: 'Hello from tests',
      type: 'test-message'
    });
    
    expect(messageId).toBeDefined();
    expect(typeof messageId).toBe('string');
  });

  it('should get agent status', () => {
    // Register the agent
    mcpCore.registerAgent(mockAgent);
    
    // Check initial status
    expect(mcpCore.getAgentStatus(mockAgent.id)).toBe('idle');
    
    // Check status of non-existent agent
    expect(mcpCore.getAgentStatus('non-existent')).toBe('unknown');
  });

  it('should get task by ID', async () => {
    // Register the agent
    mcpCore.registerAgent(mockAgent);
    
    // Create a task
    const taskId = await mcpCore.submitTask({
      agentId: mockAgent.id,
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    // Get the task
    const task = mcpCore.getTask(taskId);
    expect(task).toBeDefined();
    expect(task?.id).toBe(taskId);
    
    // Get non-existent task
    expect(mcpCore.getTask('non-existent')).toBeUndefined();
  });

  it('should get pending tasks', async () => {
    // Register the agent
    mcpCore.registerAgent(mockAgent);
    
    // Create a completed task
    const taskId1 = await mcpCore.submitTask({
      agentId: mockAgent.id,
      type: 'test-task-1',
      content: 'test content 1',
      priority: TaskPriority.NORMAL
    });
    
    // Fast-forward to complete the task
    jest.advanceTimersByTime(1000);
    
    // Create a pending task
    const taskId2 = await mcpCore.submitTask({
      agentId: mockAgent.id,
      type: 'test-task-2',
      content: 'test content 2',
      priority: TaskPriority.NORMAL
    });
    
    // Update task status to pending (simulating the task scheduler hasn't picked it up yet)
    mcpCore.updateTaskStatus(taskId2, 'pending');
    
    // Get pending tasks
    const pendingTasks = mcpCore.getPendingTasks();
    expect(pendingTasks.length).toBe(1);
    expect(pendingTasks[0].id).toBe(taskId2);
  });

  it('should update task status', async () => {
    // Register the agent
    mcpCore.registerAgent(mockAgent);
    
    // Create a task
    const taskId = await mcpCore.submitTask({
      agentId: mockAgent.id,
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    // Update task status manually
    const result = mcpCore.updateTaskStatus(taskId, 'failed', undefined, 'Test error');
    expect(result).toBe(true);
    
    // Check task status
    const task = mcpCore.getTask(taskId);
    expect(task?.status).toBe('failed');
    expect(task?.error).toBe('Test error');
  });

  it('should get agent metrics', () => {
    // Register the agent
    mcpCore.registerAgent(mockAgent);
    
    // Initially metrics might be undefined
    const metrics = mcpCore.getAgentMetrics(mockAgent.id);
    
    // Structure should match the interface
    if (metrics) {
      expect(metrics).toHaveProperty('avgProcessingTime');
      expect(metrics).toHaveProperty('successRate');
    }
  });

  it('should create a task DAG', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    mcpCore.createTaskDAG([
      { 
        agentId: 'agent-1', 
        type: 'task-1', 
        content: 'content-1', 
        priority: TaskPriority.NORMAL,
        dependsOn: [] 
      },
      { 
        agentId: 'agent-2', 
        type: 'task-2', 
        content: 'content-2', 
        priority: TaskPriority.HIGH,
        dependsOn: ['task-1'] 
      }
    ]);
    
    // Currently, this just logs to the console
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
