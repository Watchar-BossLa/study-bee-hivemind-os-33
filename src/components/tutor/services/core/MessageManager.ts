
import { BrowserEventEmitter } from './BrowserEventEmitter';
import { AgentMessage } from '../../types/mcp';
import { SpecializedAgent } from '../../types/agents';

export class MessageManager {
  private messageQueue: AgentMessage[] = [];
  private emitter: BrowserEventEmitter;
  private getAgent: (agentId: string) => SpecializedAgent | undefined;
  
  constructor(
    emitter: BrowserEventEmitter,
    getAgentFn: (agentId: string) => SpecializedAgent | undefined
  ) {
    this.emitter = emitter;
    this.getAgent = getAgentFn;
  }
  
  public sendMessage(message: Omit<AgentMessage, 'id' | 'createdAt'>): string {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const fullMessage: AgentMessage = {
      ...message,
      id: messageId,
      createdAt: new Date()
    };
    
    this.messageQueue.push(fullMessage);
    this.emitter.emit('message:sent', messageId);
    
    // Process message queue
    this.processMessageQueue();
    
    return messageId;
  }
  
  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;
    
    // Sort by priority (we'd add priority for messages in a real implementation)
    const message = this.messageQueue.shift();
    if (!message) return;
    
    // Check if recipient agent exists
    const recipientAgent = this.getAgent(message.toAgentId);
    if (!recipientAgent) {
      console.error(`Message ${message.id} has unknown recipient: ${message.toAgentId}`);
      return;
    }
    
    // Deliver message (in real implementation, this would call agent's handleMessage method)
    console.log(`Delivering message from ${message.fromAgentId} to ${message.toAgentId}`);
    this.emitter.emit('message:delivered', message);
  }
}
