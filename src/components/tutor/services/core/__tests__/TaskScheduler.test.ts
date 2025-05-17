import { TaskScheduler } from '../TaskScheduler';
import { BrowserEventEmitter } from '../BrowserEventEmitter';
import { SpecializedAgent } from '../../../types/agents';
import { Task, TaskPriority } from '../../../types/mcp';

describe('TaskScheduler', () => {
  let taskScheduler: TaskScheduler;
  let emitter: BrowserEventEmitter;
  let mockProcessTask: jest.Mock;
  
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
    mockProcessTask = jest.fn();
    taskScheduler = new TaskScheduler(emitter, mockProcessTask);
  });

  it('should add a task to the queue', () => {
    const task: Task = {
      id: 'task-1',
      name: 'Test Task',
      description: 'A test task',
      priority: TaskPriority.Normal,
      agentId: mockAgent.id,
      requires: ['test'],
      context: {}
    };
    
    taskScheduler.queueTask(task);
    expect(taskScheduler.getTaskQueue()).toContain(task);
  });

  it('should process tasks based on priority', () => {
    const task1: Task = {
      id: 'task-1',
      name: 'High Priority Task',
      description: 'A high priority task',
      priority: TaskPriority.High,
      agentId: mockAgent.id,
      requires: ['test'],
      context: {}
    };
    const task2: Task = {
      id: 'task-2',
      name: 'Low Priority Task',
      description: 'A low priority task',
      priority: TaskPriority.Low,
      agentId: mockAgent.id,
      requires: ['test'],
      context: {}
    };
    
    taskScheduler.queueTask(task2);
    taskScheduler.queueTask(task1);
    
    taskScheduler.processTaskQueue();
    
    // Expect high priority task to be processed first
    expect(mockProcessTask).toHaveBeenCalledWith(task1);
  });

  it('should emit task:completed event when a task is completed', () => {
    jest.spyOn(emitter, 'emit');
    
    const task: Task = {
      id: 'task-1',
      name: 'Test Task',
      description: 'A test task',
      priority: TaskPriority.Normal,
      agentId: mockAgent.id,
      requires: ['test'],
      context: {}
    };
    
    taskScheduler.queueTask(task);
    taskScheduler.processTaskQueue();
    
    expect(emitter.emit).toHaveBeenCalledWith('task:completed', task.id);
  });

  it('should handle task processing errors and emit task:failed event', () => {
    jest.spyOn(emitter, 'emit');
    mockProcessTask.mockImplementation(() => {
      throw new Error('Task processing failed');
    });
    
    const task: Task = {
      id: 'task-1',
      name: 'Test Task',
      description: 'A test task',
      priority: TaskPriority.Normal,
      agentId: mockAgent.id,
      requires: ['test'],
      context: {}
    };
    
    taskScheduler.queueTask(task);
    taskScheduler.processTaskQueue();
    
    expect(emitter.emit).toHaveBeenCalledWith('task:failed', task.id);
  });
});
