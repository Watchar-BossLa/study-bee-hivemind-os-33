
import { A2AOAuthHandler } from './A2AOAuthHandler';
import { 
  A2AProtocol, 
  A2AMessage, 
  A2AMessageType, 
  A2ATransportProtocol,
  A2AErrorCode
} from '../protocols/A2AProtocol';
import { EventEmitter } from 'events';
import { MCPCore } from '../core/MCPCore';

export interface ExternalAgent {
  id: string;
  name: string;
  capabilities: string[];
  url: string;
  authenticated?: boolean;
  lastSeen?: Date;
}

export interface CapabilityAdvertisement {
  id: string;
  capability: string;
  description: string;
  version?: string;
  parameters?: Record<string, any>;
  provider: string;
}

export interface MessageRouteConfig {
  maxRetries: number;
  timeoutMs: number;
  fallbackAgents?: string[];
}

/**
 * Enhanced A2A Hub implementing the full Agent-to-Agent protocol
 * from QuorumForge OS specification, including Auth0 OAuth integration
 */
export class A2AHub extends EventEmitter {
  private hubId = 'hub-' + Math.random().toString(36).substring(2, 9);
  private localCapabilities: CapabilityAdvertisement[] = [];
  private externalAgents: Map<string, ExternalAgent> = new Map();
  private activeConnections: Map<string, { startTime: Date, messageCount: number }> = new Map();
  private oauthHandler?: A2AOAuthHandler;
  private a2aProtocol: A2AProtocol;
  private capabilityRegistry: Map<string, string[]> = new Map(); // capability -> agent IDs
  private subscriptions: Map<string, Array<(message: A2AMessage) => void>> = new Map();
  private messageHistory: A2AMessage[] = [];
  private maxHistorySize = 100;
  private mcpCore?: MCPCore;
  
  constructor(oauthHandler?: A2AOAuthHandler, mcpCore?: MCPCore) {
    super();
    this.oauthHandler = oauthHandler;
    this.mcpCore = mcpCore;
    this.a2aProtocol = new A2AProtocol(this.hubId, 'StudyBee A2A Hub');
    
    // Initialize with mock external agents for demo purposes
    this.initializeMockAgents();
    console.log('A2A Hub initialized with OAuth-PKCE security');
  }
  
  /**
   * Initialize mock external agents for demonstration
   * @private
   */
  private initializeMockAgents(): void {
    const mockAgents: ExternalAgent[] = [
      {
        id: 'math-expert-1',
        name: 'External Math Tutor',
        capabilities: ['advanced-mathematics', 'calculus-explanation', 'equation-solving'],
        url: 'https://api.example.com/a2a/math-expert'
      },
      {
        id: 'language-tutor-1',
        name: 'Language Learning Assistant',
        capabilities: ['language-translation', 'grammar-correction', 'vocabulary-building'],
        url: 'https://api.example.com/a2a/language-tutor'
      },
      {
        id: 'science-specialist-1',
        name: 'Science Content Expert',
        capabilities: ['physics-explanation', 'chemistry-modeling', 'biology-concepts'],
        url: 'https://api.example.com/a2a/science-specialist'
      }
    ];
    
    mockAgents.forEach(agent => {
      this.externalAgents.set(agent.id, agent);
      
      // Register capabilities
      agent.capabilities.forEach(capability => {
        const agentsWithCapability = this.capabilityRegistry.get(capability) || [];
        agentsWithCapability.push(agent.id);
        this.capabilityRegistry.set(capability, agentsWithCapability);
      });
    });
  }
  
  /**
   * Register local capabilities
   * @param capabilities List of capabilities this hub provides
   */
  public registerCapabilities(capabilities: string[], agentId: string = this.hubId): void {
    this.localCapabilities = capabilities.map((cap, index) => ({
      id: `cap-${index}-${Date.now()}`,
      capability: cap,
      description: `Provider of ${cap} services`,
      provider: agentId,
      version: '1.0'
    }));
    
    // Register in the capability registry
    capabilities.forEach(capability => {
      const agentsWithCapability = this.capabilityRegistry.get(capability) || [];
      if (!agentsWithCapability.includes(agentId)) {
        agentsWithCapability.push(agentId);
        this.capabilityRegistry.set(capability, agentsWithCapability);
      }
    });
    
    console.log(`Registered ${capabilities.length} capabilities with A2A Hub`);
  }
  
  /**
   * Register an external agent with the hub
   */
  public registerExternalAgent(agent: ExternalAgent): void {
    this.externalAgents.set(agent.id, {
      ...agent,
      lastSeen: new Date()
    });
    
    // Register capabilities
    agent.capabilities.forEach(capability => {
      const agentsWithCapability = this.capabilityRegistry.get(capability) || [];
      if (!agentsWithCapability.includes(agent.id)) {
        agentsWithCapability.push(agent.id);
        this.capabilityRegistry.set(capability, agentsWithCapability);
      }
    });
    
    this.emit('agent:registered', agent.id);
    
    console.log(`External agent registered: ${agent.name} (${agent.id})`);
  }
  
  /**
   * Discover all available capabilities across registered agents
   */
  public async discoverCapabilities(): Promise<CapabilityAdvertisement[]> {
    console.log('Discovering capabilities across all agents');
    
    // Combine local and external capabilities
    const externalCapabilities: CapabilityAdvertisement[] = [];
    
    this.externalAgents.forEach((agent) => {
      agent.capabilities.forEach((cap, index) => {
        externalCapabilities.push({
          id: `ext-cap-${agent.id}-${index}`,
          capability: cap,
          description: `Provided by ${agent.name}`,
          provider: agent.id
        });
      });
    });
    
    return [...this.localCapabilities, ...externalCapabilities];
  }
  
  /**
   * Find agents that provide a specific capability
   */
  public findAgentsByCapability(capability: string): string[] {
    return this.capabilityRegistry.get(capability) || [];
  }
  
  /**
   * Send a message to another agent using A2A protocol
   * @param agentId Target agent ID
   * @param content Message content
   * @param options Message options
   */
  public async sendMessage(
    agentId: string,
    content: any,
    options: {
      messageType?: A2AMessageType;
      requiredCapabilities?: string[];
      metadata?: Record<string, any>;
      correlationId?: string;
      routeConfig?: MessageRouteConfig;
    } = {}
  ): Promise<A2AMessage> {
    // Find the agent
    const agent = this.externalAgents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    
    // Check capabilities if required
    if (options.requiredCapabilities && options.requiredCapabilities.length > 0) {
      const hasRequiredCapabilities = options.requiredCapabilities.every(cap => 
        agent.capabilities.includes(cap)
      );
      
      if (!hasRequiredCapabilities) {
        throw new Error(`Agent ${agentId} does not have all required capabilities`);
      }
    }
    
    // Create the message
    const message = this.a2aProtocol.createMessage(
      agentId,
      options.messageType || A2AMessageType.REQUEST,
      content,
      {
        recipientName: agent.name,
        correlationId: options.correlationId,
        transportProtocol: A2ATransportProtocol.HTTP,
        metadata: options.metadata
      }
    );
    
    // Track the connection
    this.activeConnections.set(agentId, {
      startTime: new Date(),
      messageCount: (this.activeConnections.get(agentId)?.messageCount || 0) + 1
    });
    
    // Add to message history
    this.addToMessageHistory(message);
    
    // Get authentication headers if OAuth handler exists
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.oauthHandler) {
      headers = await this.oauthHandler.createAuthHeaders();
    }
    
    console.log(`Sending message to external agent ${agentId}: ${
      typeof content === 'string' ? content.substring(0, 30) : JSON.stringify(content).substring(0, 30)
    }...`);
    
    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we simulate a response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate response
      const responseMessage = this.a2aProtocol.createResponse(message, {
        result: `Response from ${agent.name} regarding: ${
          typeof content === 'string' ? content.substring(0, 30) : JSON.stringify(content).substring(0, 30)
        }...`,
        capabilities: agent.capabilities,
        timestamp: new Date()
      });
      
      // Add response to history
      this.addToMessageHistory(responseMessage);
      
      // Notify subscribers
      this.notifySubscribers(responseMessage);
      
      // End the connection
      this.activeConnections.delete(agentId);
      
      return responseMessage;
    } catch (error) {
      // End the connection
      this.activeConnections.delete(agentId);
      
      // Create error message
      const errorMessage = this.a2aProtocol.createErrorResponse(
        message,
        A2AErrorCode.INTERNAL_ERROR,
        (error as Error).message || 'Unknown error'
      );
      
      // Add error to history
      this.addToMessageHistory(errorMessage);
      
      throw error;
    }
  }
  
  /**
   * Subscribe to messages that match a filter
   */
  public subscribe(
    filter: {
      messageType?: A2AMessageType;
      senderId?: string;
      recipientId?: string;
      correlationId?: string;
    },
    callback: (message: A2AMessage) => void
  ): string {
    const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Store the subscription with the filter criteria
    const subscriptionKey = JSON.stringify(filter);
    const callbacks = this.subscriptions.get(subscriptionKey) || [];
    callbacks.push(callback);
    this.subscriptions.set(subscriptionKey, callbacks);
    
    console.log(`New subscription created with ID: ${subscriptionId}`);
    
    return subscriptionId;
  }
  
  /**
   * Get the list of active connections
   */
  public getActiveConnections(): Array<{
    agentId: string;
    startTime: Date;
    messageCount: number;
  }> {
    const connections: Array<{
      agentId: string;
      startTime: Date;
      messageCount: number;
    }> = [];
    
    this.activeConnections.forEach((connection, agentId) => {
      connections.push({
        agentId,
        ...connection
      });
    });
    
    return connections;
  }
  
  /**
   * Get the list of registered external agents
   */
  public getExternalAgents(): ExternalAgent[] {
    return Array.from(this.externalAgents.values());
  }
  
  /**
   * Route a message to an agent based on capability requirements
   */
  public async routeMessageByCapability(
    capability: string,
    content: any,
    options: {
      messageType?: A2AMessageType;
      metadata?: Record<string, any>;
      routeConfig?: MessageRouteConfig;
    } = {}
  ): Promise<A2AMessage | null> {
    // Find agents with the required capability
    const agentIds = this.findAgentsByCapability(capability);
    
    if (agentIds.length === 0) {
      console.log(`No agents found with capability: ${capability}`);
      return null;
    }
    
    // In a real implementation, we would select the best agent based on availability, past performance, etc.
    // For this demo, just use the first one
    const agentId = agentIds[0];
    
    try {
      return await this.sendMessage(agentId, content, {
        ...options,
        requiredCapabilities: [capability]
      });
    } catch (error) {
      console.error(`Error routing message for capability ${capability}:`, error);
      
      // If fallback agents specified and we have other options
      if (options.routeConfig?.fallbackAgents && options.routeConfig.fallbackAgents.length > 0) {
        for (const fallbackId of options.routeConfig.fallbackAgents) {
          try {
            return await this.sendMessage(fallbackId, content, options);
          } catch (fallbackError) {
            console.error(`Fallback agent ${fallbackId} also failed:`, fallbackError);
          }
        }
      }
      
      return null;
    }
  }
  
  /**
   * Integrate with MCP-Core if available
   */
  public integrateMCPCore(mcpCore: MCPCore): void {
    this.mcpCore = mcpCore;
    
    // Setup message forwarding between MCP and A2A
    this.on('message:received', (message) => {
      // Forward relevant messages to MCP-Core
      if (this.mcpCore && message.header.messageType === A2AMessageType.REQUEST) {
        // Fix the property access in the object being passed to sendMessage
        this.mcpCore.sendMessage({
          fromAgentId: message.header.sender.id,
          toAgentId: message.header.recipient.id,
          content: message.body.content,
          type: 'a2a',
          correlationId: message.header.correlationId,
          createdAt: new Date(message.header.timestamp),
          metadata: message.body.metadata
        });
      }
    });
    
    console.log('A2A Hub integrated with MCP-Core');
  }
  
  // Private helper methods
  
  private addToMessageHistory(message: A2AMessage): void {
    this.messageHistory.push(message);
    
    // Keep history capped to max size
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift();
    }
    
    // Emit the message for subscribers
    this.emit('message:' + message.header.messageType, message);
    this.emit('message:any', message);
    
    if (message.header.recipient.id === this.hubId) {
      this.emit('message:received', message);
    }
  }
  
  private notifySubscribers(message: A2AMessage): void {
    // Check all subscription filters
    this.subscriptions.forEach((callbacks, filterKey) => {
      const filter = JSON.parse(filterKey);
      let matches = true;
      
      // Check if message matches filter
      if (filter.messageType && filter.messageType !== message.header.messageType) {
        matches = false;
      }
      
      if (filter.senderId && filter.senderId !== message.header.sender.id) {
        matches = false;
      }
      
      if (filter.recipientId && filter.recipientId !== message.header.recipient.id) {
        matches = false;
      }
      
      if (filter.correlationId && filter.correlationId !== message.header.correlationId) {
        matches = false;
      }
      
      // If matching, notify all callbacks
      if (matches) {
        callbacks.forEach(callback => {
          try {
            callback(message);
          } catch (error) {
            console.error('Error in subscription callback:', error);
          }
        });
      }
    });
  }
}

// Export factory function
export function createA2AHub(oauthHandler?: A2AOAuthHandler, mcpCore?: MCPCore): A2AHub {
  return new A2AHub(oauthHandler, mcpCore);
}
