
import { TaskScheduler } from '../TaskScheduler';
import { BrowserEventEmitter } from '../BrowserEventEmitter';
import { AgentManager } from '../AgentManager';
import { TaskManager } from '../TaskManager';
import { TaskPriority, AgentTask } from '../../types/mcp';
import { SpecializedAgent } from '../../types/agents';

describe('TaskScheduler', () => {
  let taskScheduler: TaskScheduler;
  let emitter: BrowserEventEmitter;
  let agentManager: AgentManager;
  let taskManager: TaskManager;
  
  // Setup mock agent
  const mockAgent: SpecializedAgent = {
    id: 'test-agent',
    name: 'Test Agent',
    description: 'A test agent for scheduling',
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
    
    emitter = new BrowserEventEmitter();
    jest.spyOn(emitter, 'on');
    jest.spyOn(emitter, 'emit');
    
    agentManager = new AgentManager(emitter);
    taskManager = new TaskManager(emitter);
    
    // Register mock agent
    agentManager.registerAgent(mockAgent);
    
    taskScheduler = new TaskScheduler(emitter, agentManager, taskManager);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should set up event listeners on initialization', () => {
    expect(emitter.on).toHaveBeenCalledWith('task:completed', expect.any(Function));
    expect(emitter.on).toHaveBeenCalledWith('task:failed', expect.any(Function));
  });

  it('should schedule a task for processing', () => {
    const taskId = taskManager.createTask({
      agentId: mockAgent.id,
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    const task = taskManager.getTask(taskId);
    
    if (!task) {
      fail('Task should exist');
      return;
    }
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    taskScheduler.scheduleTask(task);
    
    // Should mark agent as busy
    expect(agentManager.getAgentStatus(mockAgent.id)).toBe('busy');
    
    // Should update task status to processing
    expect(taskManager.getTask(taskId)?.status).toBe('processing');
    
    // Fast-forward timer
    jest.advanceTimersByTime(1000);
    
    // Should update task to completed
    const updatedTask = taskManager.getTask(taskId);
    expect(updatedTask?.status).toBe('completed');
    
    // Should mark agent as idle again
    expect(agentManager.getAgentStatus(mockAgent.id)).toBe('idle');
    
    // Should update agent metrics
    const metrics = agentManager.getAgentMetrics(mockAgent.id);
    expect(metrics).toBeDefined();
    expect(metrics?.successRate).toBeGreaterThan(0);
    
    consoleSpy.mockRestore();
  });

  it('should handle task for non-existent agent', () => {
    const taskId = taskManager.createTask({
      agentId: 'non-existent-agent',
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    const task = taskManager.getTask(taskId);
    
    if (!task) {
      fail('Task should exist');
      return;
    }
    
    taskScheduler.scheduleTask(task);
    
    // Task should be marked as failed
    expect(taskManager.getTask(taskId)?.status).toBe('failed');
    expect(taskManager.getTask(taskId)?.error).toBe('Agent not found');
  });

  it('should handle agent at capacity', () => {
    // Set agent capacity to 1
    agentManager.updateAgentQuota(mockAgent.id, (quota) => ({
      ...quota,
      maxConcurrentTasks: 1,
      currentUsage: 1 // Already at capacity
    }));
    
    const taskId = taskManager.createTask({
      agentId: mockAgent.id,
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    const task = taskManager.getTask(taskId);
    
    if (!task) {
      fail('Task should exist');
      return;
    }
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    taskScheduler.scheduleTask(task);
    
    // Task should remain in pending state
    expect(taskManager.getTask(taskId)?.status).toBe('pending');
    
    consoleSpy.mockRestore();
  });

  it('should check for next tasks when a task completes', () => {
    // Create a task
    const taskId = taskManager.createTask({
      agentId: mockAgent.id,
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    // Mock checkForNextTasks
    const spy = jest.spyOn(taskScheduler, 'checkForNextTasks');
    
    // Manually emit task completed event
    emitter.emit('task:completed', taskId);
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should check for next tasks when a task fails', () => {
    // Create a task
    const taskId = taskManager.createTask({
      agentId: mockAgent.id,
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    // Mock checkForNextTasks
    const spy = jest.spyOn(taskScheduler, 'checkForNextTasks');
    
    // Manually emit task failed event
    emitter.emit('task:failed', taskId);
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
