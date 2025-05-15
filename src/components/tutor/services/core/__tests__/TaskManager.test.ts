
import { TaskManager } from '../TaskManager';
import { BrowserEventEmitter } from '../BrowserEventEmitter';
import { TaskPriority } from '../../types/mcp';

describe('TaskManager', () => {
  let taskManager: TaskManager;
  let emitter: BrowserEventEmitter;

  beforeEach(() => {
    emitter = new BrowserEventEmitter();
    jest.spyOn(emitter, 'emit');
    taskManager = new TaskManager(emitter);
  });

  it('should create a task and emit task:submitted event', () => {
    const taskId = taskManager.createTask({
      agentId: 'agent-1',
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });

    expect(taskId).toBeDefined();
    expect(typeof taskId).toBe('string');
    expect(emitter.emit).toHaveBeenCalledWith('task:submitted', taskId);
    
    const task = taskManager.getTask(taskId);
    expect(task).toBeDefined();
    expect(task?.agentId).toBe('agent-1');
    expect(task?.type).toBe('test-task');
    expect(task?.content).toBe('test content');
    expect(task?.priority).toBe(TaskPriority.NORMAL);
    expect(task?.status).toBe('pending');
  });

  it('should return undefined for non-existent task', () => {
    const task = taskManager.getTask('non-existent-task');
    expect(task).toBeUndefined();
  });

  it('should get pending tasks sorted by priority', () => {
    // Create tasks with different priorities
    const highPriorityTaskId = taskManager.createTask({
      agentId: 'agent-1',
      type: 'high-priority',
      content: 'high',
      priority: TaskPriority.HIGH
    });
    
    const lowPriorityTaskId = taskManager.createTask({
      agentId: 'agent-1',
      type: 'low-priority',
      content: 'low',
      priority: TaskPriority.LOW
    });
    
    const normalPriorityTaskId = taskManager.createTask({
      agentId: 'agent-1',
      type: 'normal-priority',
      content: 'normal',
      priority: TaskPriority.NORMAL
    });
    
    // Set one task to completed
    taskManager.updateTaskStatus(normalPriorityTaskId, 'completed');
    
    // Get pending tasks
    const pendingTasks = taskManager.getPendingTasks();
    
    // Should have 2 pending tasks
    expect(pendingTasks.length).toBe(2);
    
    // First task should be high priority
    expect(pendingTasks[0].id).toBe(highPriorityTaskId);
    expect(pendingTasks[1].id).toBe(lowPriorityTaskId);
  });

  it('should update task status and emit events', () => {
    const taskId = taskManager.createTask({
      agentId: 'agent-1',
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    // Update to processing
    let result = taskManager.updateTaskStatus(taskId, 'processing');
    expect(result).toBe(true);
    expect(emitter.emit).toHaveBeenCalledWith('task:updated', taskId, 'processing');
    
    let task = taskManager.getTask(taskId);
    expect(task?.status).toBe('processing');
    
    // Update to completed with result
    result = taskManager.updateTaskStatus(taskId, 'completed', { success: true });
    expect(result).toBe(true);
    expect(emitter.emit).toHaveBeenCalledWith('task:updated', taskId, 'completed');
    expect(emitter.emit).toHaveBeenCalledWith('task:completed', taskId);
    
    task = taskManager.getTask(taskId);
    expect(task?.status).toBe('completed');
    expect(task?.result).toEqual({ success: true });
    
    // Try to update non-existent task
    result = taskManager.updateTaskStatus('non-existent-task', 'failed');
    expect(result).toBe(false);
  });

  it('should handle task failure and emit task:failed event', () => {
    const taskId = taskManager.createTask({
      agentId: 'agent-1',
      type: 'test-task',
      content: 'test content',
      priority: TaskPriority.NORMAL
    });
    
    // Update to failed with error
    const result = taskManager.updateTaskStatus(taskId, 'failed', undefined, 'Error message');
    expect(result).toBe(true);
    expect(emitter.emit).toHaveBeenCalledWith('task:updated', taskId, 'failed');
    expect(emitter.emit).toHaveBeenCalledWith('task:failed', taskId);
    
    const task = taskManager.getTask(taskId);
    expect(task?.status).toBe('failed');
    expect(task?.error).toBe('Error message');
  });

  it('should create a task DAG', () => {
    // This test only verifies the method is called since DAG implementation is a stub
    const spy = jest.spyOn(console, 'log').mockImplementation();
    
    taskManager.createTaskDAG([
      { 
        agentId: 'agent-1', 
        type: 'task-1', 
        content: 'content-1', 
        priority: TaskPriority.NORMAL 
      },
      { 
        agentId: 'agent-2', 
        type: 'task-2', 
        content: 'content-2', 
        priority: TaskPriority.HIGH,
        dependsOn: ['task-1'] 
      }
    ]);
    
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
