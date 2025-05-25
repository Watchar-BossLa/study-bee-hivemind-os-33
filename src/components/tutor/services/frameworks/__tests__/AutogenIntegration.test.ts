
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AutogenIntegration } from '../AutogenIntegration';

// Create a complete mock of MCPCore
const createMockMCPCore = () => ({
  submitTask: vi.fn(),
  waitForTaskCompletion: vi.fn(),
  getTaskStatus: vi.fn(),
  registerAgent: vi.fn(),
  getAgent: vi.fn(),
  removeAgent: vi.fn(),
  tasks: new Map(),
  agents: new Map(),
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  },
  taskHandlers: new Map(),
  messageHandlers: new Map(),
  initialize: vi.fn(),
  shutdown: vi.fn(),
  getMetrics: vi.fn(),
  pauseTask: vi.fn(),
  resumeTask: vi.fn(),
  cancelTask: vi.fn(),
  listTasks: vi.fn(),
  listAgents: vi.fn(),
  getTaskHistory: vi.fn(),
  updateTaskPriority: vi.fn(),
  updateTaskPayload: vi.fn(),
  registerTaskHandler: vi.fn(),
  unregisterTaskHandler: vi.fn(),
  setupEventListeners: vi.fn(),
  processTask: vi.fn(),
  sendMessage: vi.fn(),
  receiveMessage: vi.fn(),
  broadcastMessage: vi.fn(),
  getAgentList: vi.fn(),
  updateAgentStatus: vi.fn()
});

describe('AutogenIntegration', () => {
  let autogenIntegration: AutogenIntegration;
  let mockMCPCore: ReturnType<typeof createMockMCPCore>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMCPCore = createMockMCPCore();
    autogenIntegration = new AutogenIntegration(mockMCPCore as any);
  });

  it('should create AutogenIntegration instance', () => {
    expect(autogenIntegration).toBeInstanceOf(AutogenIntegration);
  });

  it('should run security review', async () => {
    const mockResult = {
      vulnerabilitiesFound: 2,
      severityLevels: ['medium', 'low'],
      recommendations: ['Fix input validation', 'Update dependencies'],
      patchedCode: 'secure code here',
      conversationSummary: 'Security review completed'
    };

    mockMCPCore.submitTask.mockResolvedValue('task-123');
    mockMCPCore.waitForTaskCompletion.mockResolvedValue({ result: mockResult });

    const result = await autogenIntegration.runSecurityReview('const x = 1;', {});

    expect(mockMCPCore.submitTask).toHaveBeenCalledWith({
      type: 'security_review',
      payload: {
        codeSnippet: 'const x = 1;',
        context: {}
      }
    });
    expect(result).toEqual(mockResult);
  });

  it('should handle security review failure', async () => {
    mockMCPCore.submitTask.mockRejectedValue(new Error('Task submission failed'));

    await expect(
      autogenIntegration.runSecurityReview('const x = 1;', {})
    ).rejects.toThrow('Task submission failed');
  });

  it('should run collaborative analysis', async () => {
    const mockResult = {
      analysis: 'Collaborative analysis completed',
      insights: ['Insight 1', 'Insight 2'],
      recommendations: ['Recommendation 1']
    };

    mockMCPCore.submitTask.mockResolvedValue('task-456');
    mockMCPCore.waitForTaskCompletion.mockResolvedValue({ result: mockResult });

    const result = await autogenIntegration.runCollaborativeAnalysis(['agent1', 'agent2'], 'test prompt');

    expect(mockMCPCore.submitTask).toHaveBeenCalledWith({
      type: 'collaborative_analysis',
      payload: {
        agents: ['agent1', 'agent2'],
        prompt: 'test prompt'
      }
    });
    expect(result).toEqual(mockResult);
  });

  it('should work without MCPCore', async () => {
    const standaloneIntegration = new AutogenIntegration();
    
    const result = await standaloneIntegration.runSecurityReview('const x = 1;', {});
    
    expect(result).toEqual({
      vulnerabilitiesFound: 0,
      severityLevels: [],
      recommendations: [],
      patchedCode: 'const x = 1;',
      conversationSummary: 'Security review completed (simulated)'
    });
  });
});
