
import { A2AProtocol, A2AMessageType, A2ATransportProtocol } from '../protocols/A2AProtocol';
import { A2AOAuthHandler } from './A2AOAuthHandler';
import { MCPCore } from '../core/MCPCore';
import { v4 as uuidv4 } from '@/lib/uuid';

export interface A2ACapability {
  capability: string;
  version?: string;
  description?: string;
  parameters?: Record<string, any>;
  provider?: string;
  scope?: string[];
}

export interface A2AAgent {
  id: string;
  name: string;
  capabilities: A2ACapability[];
  url?: string;
  connectionType: 'local' | 'remote' | 'p2p';
  lastSeen?: Date;
  trustLevel?: 'low' | 'medium' | 'high';
}

/**
 * A2A Hub - Central hub for Agent-to-Agent communication
 * Implements the A2A Protocol as defined in QuorumForge OS spec
 */
export class A2AHub {
  private protocol: A2AProtocol;
  private oauthHandler?: A2AOAuthHandler;
  private mcpCore?: MCPCore;
  private localCapabilities: A2ACapability[] = [];
  private knownAgents: Map<string, A2AAgent> = new Map();
  private messageHistory: any[] = [];
  
  constructor(hubId: string = 'main-hub', oauthHandler?: A2AOAuthHandler, mcpCore?: MCPCore) {
    this.protocol = new A2AProtocol(hubId, 'A2AHub');
    this.oauthHandler = oauthHandler;
    this.mcpCore = mcpCore;
    
    console.log('A2A Hub initialized');
  }
  
  /**
   * Register MCP Core with the hub
   */
  public integrateMCPCore(mcpCore: MCPCore): void {
    this.mcpCore = mcpCore;
    console.log('MCP Core integrated with A2A Hub');
  }
  
  /**
   * Register local capabilities
   */
  public registerCapabilities(capabilities: (string | A2ACapability)[]): void {
    const formattedCapabilities = capabilities.map(cap => {
      if (typeof cap === 'string') {
        return {
          capability: cap,
          version: '1.0',
          provider: 'local'
        };
      }
      return {
        ...cap,
        provider: cap.provider || 'local'
      };
    });
    
    this.localCapabilities = [...this.localCapabilities, ...formattedCapabilities];
    console.log(`Registered ${formattedCapabilities.length} capabilities with A2A Hub`);
  }
  
  /**
   * Register an external agent
   */
  public registerAgent(agent: A2AAgent): void {
    this.knownAgents.set(agent.id, agent);
    console.log(`Registered agent ${agent.name} (${agent.id}) with A2A Hub`);
  }
  
  /**
   * Send a message to an agent
   */
  public async sendMessage(
    agentId: string, 
    content: any, 
    options: {
      correlationId?: string;
      ttl?: number;
      metadata?: Record<string, any>;
      requiredCapabilities?: string[];
    } = {}
  ): Promise<any> {
    // Check if we know this agent
    const agent = this.knownAgents.get(agentId);
    if (!agent) {
      throw new Error(`Unknown agent: ${agentId}`);
    }
    
    // Check capabilities if required
    if (options.requiredCapabilities && options.requiredCapabilities.length > 0) {
      const hasAllCapabilities = options.requiredCapabilities.every(cap => 
        agent.capabilities.some(agentCap => agentCap.capability === cap)
      );
      
      if (!hasAllCapabilities) {
        throw new Error(`Agent ${agentId} does not have all required capabilities`);
      }
    }
    
    // Create message using protocol
    const message = this.protocol.createMessage(
      agentId,
      A2AMessageType.REQUEST,
      content,
      {
        recipientName: agent.name,
        correlationId: options.correlationId,
        transportProtocol: agent.connectionType === 'remote' 
          ? A2ATransportProtocol.HTTP 
          : A2ATransportProtocol.INTERNAL,
        ttl: options.ttl,
        metadata: options.metadata
      }
    );
    
    console.log(`Sending message to ${agent.name} (${agentId})`);
    
    // Store in history
    this.messageHistory.push({
      direction: 'outgoing',
      message,
      timestamp: new Date()
    });
    
    // For local agents, use MCP Core
    if (agent.connectionType === 'local' && this.mcpCore) {
      const mcpMessage = {
        id: message.header.messageId,
        fromAgentId: message.header.sender.id,
        toAgentId: agentId,
        content: message.body.content,
        type: 'a2a_message',
        metadata: message.body.metadata
      };
      
      await this.mcpCore.sendMessage(mcpMessage);
    }
    
    // Simulate response
    const response = this.protocol.createResponse(
      message,
      { success: true, result: `Processed request from ${message.header.sender.id}` }
    );
    
    return response;
  }
  
  /**
   * Route a message by capability
   */
  public async routeMessageByCapability(
    capability: string,
    content: any,
    options: {
      correlationId?: string;
      ttl?: number;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<any | null> {
    // Find agents with this capability
    const agentsWithCapability = Array.from(this.knownAgents.values())
      .filter(agent => agent.capabilities.some(cap => cap.capability === capability));
    
    if (agentsWithCapability.length === 0) {
      console.log(`No agents found with capability: ${capability}`);
      return null;
    }
    
    // Select the first agent with the capability
    const selectedAgent = agentsWithCapability[0];
    
    return this.sendMessage(selectedAgent.id, content, {
      ...options,
      requiredCapabilities: [capability]
    });
  }
  
  /**
   * Discover capabilities across all agents
   */
  public async discoverCapabilities(): Promise<A2ACapability[]> {
    const allCapabilities = [...this.localCapabilities];
    
    // Add capabilities from known agents
    for (const agent of this.knownAgents.values()) {
      allCapabilities.push(...agent.capabilities);
    }
    
    return allCapabilities;
  }
  
  /**
   * Create a message for MCP Core
   */
  public createMCPMessage(
    fromAgentId: string,
    toAgentId: string,
    content: any,
    metadata?: Record<string, any>
  ) {
    if (!this.mcpCore) {
      throw new Error('MCP Core not integrated with A2A Hub');
    }
    
    return {
      id: uuidv4(),
      fromAgentId,
      toAgentId,
      content,
      type: 'a2a_message',
      metadata
    };
  }
}

// Export factory function
export function createA2AHub(
  oauthHandler?: A2AOAuthHandler, 
  mcpCore?: MCPCore
): A2AHub {
  return new A2AHub(uuidv4(), oauthHandler, mcpCore);
}
