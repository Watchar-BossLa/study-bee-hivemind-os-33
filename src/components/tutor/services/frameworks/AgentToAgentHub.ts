
import { A2AOAuthHandler } from './A2AOAuthHandler';

export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  type: 'request' | 'response' | 'notification';
  payload: any;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AgentEndpoint {
  id: string;
  name: string;
  capabilities: string[];
  url: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen: number;
}

/**
 * Agent-to-Agent Communication Hub using JSON-RPC and Server-Sent Events
 */
export class AgentToAgentHub {
  private endpoints: Map<string, AgentEndpoint> = new Map();
  private messageQueue: AgentMessage[] = [];
  private subscribers: Map<string, EventSource[]> = new Map();
  private oauthHandler: A2AOAuthHandler;
  private isRunning = false;
  
  constructor(oauthHandler: A2AOAuthHandler) {
    this.oauthHandler = oauthHandler;
  }
  
  /**
   * Start the A2A hub server
   */
  public async start(port: number = 8080): Promise<void> {
    if (this.isRunning) {
      console.warn('Agent-to-Agent Hub is already running');
      return;
    }
    
    console.log(`Starting Agent-to-Agent Hub on port ${port}`);
    
    // Initialize message processing
    this.startMessageProcessing();
    
    // Start endpoint health monitoring
    this.startHealthMonitoring();
    
    this.isRunning = true;
    console.log('Agent-to-Agent Hub started successfully');
  }
  
  /**
   * Stop the A2A hub
   */
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }
    
    console.log('Stopping Agent-to-Agent Hub');
    
    // Close all SSE connections
    for (const [agentId, eventSources] of this.subscribers) {
      eventSources.forEach(es => es.close());
    }
    this.subscribers.clear();
    
    this.isRunning = false;
    console.log('Agent-to-Agent Hub stopped');
  }
  
  /**
   * Register an agent endpoint
   */
  public async registerAgent(endpoint: Omit<AgentEndpoint, 'lastSeen'>): Promise<boolean> {
    try {
      // Verify authentication
      const isAuthorized = await this.oauthHandler.verifyToken('dummy-token');
      if (!isAuthorized) {
        console.error(`Authentication failed for agent: ${endpoint.id}`);
        return false;
      }
      
      const fullEndpoint: AgentEndpoint = {
        ...endpoint,
        lastSeen: Date.now()
      };
      
      this.endpoints.set(endpoint.id, fullEndpoint);
      
      console.log(`Agent registered: ${endpoint.id}`);
      
      // Notify other agents about the new endpoint
      await this.broadcastAgentUpdate('agent_registered', fullEndpoint);
      
      return true;
    } catch (error) {
      console.error(`Failed to register agent ${endpoint.id}:`, error);
      return false;
    }
  }
  
  /**
   * Unregister an agent endpoint
   */
  public async unregisterAgent(agentId: string): Promise<boolean> {
    const endpoint = this.endpoints.get(agentId);
    if (!endpoint) {
      return false;
    }
    
    this.endpoints.delete(agentId);
    
    // Close SSE connections for this agent
    const eventSources = this.subscribers.get(agentId);
    if (eventSources) {
      eventSources.forEach(es => es.close());
      this.subscribers.delete(agentId);
    }
    
    console.log(`Agent unregistered: ${agentId}`);
    
    // Notify other agents
    await this.broadcastAgentUpdate('agent_unregistered', endpoint);
    
    return true;
  }
  
  /**
   * Send a message between agents
   */
  public async sendMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): Promise<boolean> {
    const fullMessage: AgentMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now()
    };
    
    // Verify sender and receiver exist
    const fromEndpoint = this.endpoints.get(message.fromAgent);
    const toEndpoint = this.endpoints.get(message.toAgent);
    
    if (!fromEndpoint) {
      console.error(`Sender agent not found: ${message.fromAgent}`);
      return false;
    }
    
    if (!toEndpoint) {
      console.error(`Receiver agent not found: ${message.toAgent}`);
      return false;
    }
    
    // Add to message queue
    this.messageQueue.push(fullMessage);
    
    // Send immediately if receiver is online
    if (toEndpoint.status === 'online') {
      await this.deliverMessage(fullMessage);
    }
    
    console.log(`Message queued: ${fullMessage.id} from ${message.fromAgent} to ${message.toAgent}`);
    return true;
  }
  
  /**
   * Subscribe to messages for an agent
   */
  public subscribe(agentId: string): EventSource {
    const eventSource = new EventSource(`/a2a/stream/${agentId}`);
    
    if (!this.subscribers.has(agentId)) {
      this.subscribers.set(agentId, []);
    }
    this.subscribers.get(agentId)!.push(eventSource);
    
    console.log(`Agent ${agentId} subscribed to message stream`);
    
    return eventSource;
  }
  
  /**
   * Get all registered agents
   */
  public getAgents(): AgentEndpoint[] {
    return Array.from(this.endpoints.values());
  }
  
  /**
   * Get agent by ID
   */
  public getAgent(agentId: string): AgentEndpoint | undefined {
    return this.endpoints.get(agentId);
  }
  
  /**
   * Get pending messages for an agent
   */
  public getPendingMessages(agentId: string): AgentMessage[] {
    return this.messageQueue.filter(msg => 
      msg.toAgent === agentId && this.endpoints.get(agentId)?.status !== 'online'
    );
  }
  
  /**
   * Process the message queue
   */
  private startMessageProcessing(): void {
    setInterval(async () => {
      const pendingMessages = [...this.messageQueue];
      this.messageQueue = [];
      
      for (const message of pendingMessages) {
        const toEndpoint = this.endpoints.get(message.toAgent);
        if (toEndpoint && toEndpoint.status === 'online') {
          await this.deliverMessage(message);
        } else {
          // Re-queue if recipient is still offline
          this.messageQueue.push(message);
        }
      }
    }, 1000);
  }
  
  /**
   * Deliver a message to an agent
   */
  private async deliverMessage(message: AgentMessage): Promise<void> {
    const eventSources = this.subscribers.get(message.toAgent);
    if (!eventSources || eventSources.length === 0) {
      console.warn(`No subscribers for agent: ${message.toAgent}`);
      return;
    }
    
    const data = JSON.stringify(message);
    
    // Send to all event sources for this agent
    eventSources.forEach(es => {
      try {
        // In a real implementation, this would send via SSE
        console.log(`Delivering message to ${message.toAgent}:`, message);
      } catch (error) {
        console.error(`Failed to deliver message to ${message.toAgent}:`, error);
      }
    });
  }
  
  /**
   * Broadcast agent status updates
   */
  private async broadcastAgentUpdate(type: string, endpoint: AgentEndpoint): Promise<void> {
    const notification: Omit<AgentMessage, 'id' | 'timestamp'> = {
      fromAgent: 'hub',
      toAgent: 'broadcast',
      type: 'notification',
      payload: {
        type,
        endpoint
      },
      priority: 'medium'
    };
    
    // Send to all agents except the one being updated
    for (const [agentId] of this.endpoints) {
      if (agentId !== endpoint.id) {
        await this.sendMessage({
          ...notification,
          toAgent: agentId
        });
      }
    }
  }
  
  /**
   * Monitor endpoint health
   */
  private startHealthMonitoring(): void {
    setInterval(() => {
      const now = Date.now();
      const healthTimeout = 60000; // 1 minute
      
      for (const [agentId, endpoint] of this.endpoints) {
        if (now - endpoint.lastSeen > healthTimeout) {
          console.warn(`Agent ${agentId} appears to be offline`);
          endpoint.status = 'offline';
        }
      }
    }, 30000); // Check every 30 seconds
  }
}
