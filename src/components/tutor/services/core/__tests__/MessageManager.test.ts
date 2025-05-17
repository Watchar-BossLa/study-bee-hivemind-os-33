
import { MessageManager } from '../MessageManager';
import { BrowserEventEmitter } from '../BrowserEventEmitter';
import { SpecializedAgent } from '../../../types/agents';

describe('MessageManager', () => {
  let messageManager: MessageManager;
  let emitter: BrowserEventEmitter;
  let mockGetAgent: jest.Mock;
  
  const mockAgent: SpecializedAgent = {
    id: 'agent-recipient',
    name: 'Recipient Agent',
    description: 'A recipient test agent',
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
    
    mockGetAgent = jest.fn().mockImplementation((agentId) => {
      if (agentId === mockAgent.id) {
        return mockAgent;
      }
      return undefined;
    });
    
    messageManager = new MessageManager(emitter, mockGetAgent);
  });

  it('should send a message and emit message:sent event', () => {
    const messageId = messageManager.sendMessage({
      fromAgentId: 'agent-sender',
      toAgentId: mockAgent.id,
      content: 'Test message',
      type: 'test'
    });
    
    expect(messageId).toBeDefined();
    expect(typeof messageId).toBe('string');
    expect(emitter.emit).toHaveBeenCalledWith('message:sent', messageId);
  });

  it('should process message queue and deliver to valid recipient', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    messageManager.sendMessage({
      fromAgentId: 'agent-sender',
      toAgentId: mockAgent.id,
      content: 'Test message',
      type: 'test'
    });
    
    expect(mockGetAgent).toHaveBeenCalledWith(mockAgent.id);
    expect(emitter.emit).toHaveBeenCalledWith('message:delivered', expect.objectContaining({
      fromAgentId: 'agent-sender',
      toAgentId: mockAgent.id,
      content: 'Test message',
      type: 'test'
    }));
    
    expect(consoleSpy).toHaveBeenCalledWith(`Delivering message from agent-sender to ${mockAgent.id}`);
    consoleSpy.mockRestore();
  });

  it('should log error when recipient agent does not exist', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    messageManager.sendMessage({
      fromAgentId: 'agent-sender',
      toAgentId: 'non-existent-agent',
      content: 'Test message',
      type: 'test'
    });
    
    expect(mockGetAgent).toHaveBeenCalledWith('non-existent-agent');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('has unknown recipient: non-existent-agent'));
    
    errorSpy.mockRestore();
  });
});
