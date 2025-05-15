
import { AgentTaskManager } from '../AgentTaskManager';
import { MCPCore, TaskPriority } from '../../core/MCPCore';

// Mock MCPCore
jest.mock('../../core/MCPCore', () => {
  const mockSubmitTask = jest.fn().mockImplementation(() => 'mock-task-id');
  const mockGetTask = jest.fn().mockImplementation(() => ({
    id: 'mock-task-id',
    status: 'completed',
    result: { data: 'test-result' }
  }));

  class MockMCPCore {
    submitTask = mockSubmitTask;
    getTask = mockGetTask;
  }

  return {
    MCPCore: MockMCPCore,
    TaskPriority: {
      LOW: 0,
      NORMAL: 1,
      HIGH: 2,
      CRITICAL: 3
    }
  };
});

describe('AgentTaskManager', () => {
  let agentTaskManager: AgentTaskManager;
  let mcpCore: MCPCore;

  beforeEach(() => {
    mcpCore = new MCPCore();
    agentTaskManager = new AgentTaskManager(mcpCore);
  });

  it('should submit a task with the correct priority mapping', async () => {
    const taskId = await agentTaskManager.submitAgentTask(
      'test-agent',
      'test-task',
      { data: 'test' },
      'high'
    );
    
    expect(taskId).toBe('mock-task-id');
    expect(mcpCore.submitTask).toHaveBeenCalledWith({
      agentId: 'test-agent',
      type: 'test-task',
      content: { data: 'test' },
      priority: TaskPriority.HIGH
    });
  });

  it('should use normal priority by default', async () => {
    await agentTaskManager.submitAgentTask(
      'test-agent',
      'test-task',
      { data: 'test' }
    );
    
    expect(mcpCore.submitTask).toHaveBeenCalledWith(expect.objectContaining({
      priority: TaskPriority.NORMAL
    }));
  });

  it('should get task status and result', () => {
    const status = agentTaskManager.getTaskStatus('mock-task-id');
    
    expect(mcpCore.getTask).toHaveBeenCalledWith('mock-task-id');
    expect(status).toEqual({
      status: 'completed',
      result: { data: 'test-result' }
    });
  });

  it('should return unknown status for non-existent task', () => {
    // Override the mock to simulate a missing task
    jest.spyOn(mcpCore, 'getTask').mockReturnValueOnce(undefined);
    
    const status = agentTaskManager.getTaskStatus('non-existent');
    
    expect(status).toEqual({ status: 'unknown' });
  });
});
