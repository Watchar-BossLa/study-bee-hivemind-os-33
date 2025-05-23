
import { A2AHub } from '../frameworks/A2AHub';
import { A2AOAuthHandler } from '../frameworks/A2AOAuthHandler';
import { MCPCore } from '../core/MCPCore';
import { v4 as uuidv4 } from '@/lib/uuid';

export interface A2AMessageOptions {
  correlationId?: string;
  ttl?: number;
  metadata?: Record<string, any>;
  requiredCapabilities?: string[];
}

/**
 * A2A Communication Manager - Manages agent-to-agent communication
 * Implements the a2a-p2p-hub feature from QuorumForge OS spec
 */
export class A2ACommunicationManager {
  private a2aHub: A2AHub;
  private oauthHandler: A2AOAuthHandler;
  private mcpCore: MCPCore;
  private localAgentId: string;
  
  constructor(mcpCore: MCPCore) {
    this.oauthHandler = new A2AOAuthHandler();
    this.mcpCore = mcpCore;
    this.localAgentId = uuidv4();
    this.a2aHub = new A2AHub('secondary-hub', this.oauthHandler, this.mcpCore);
    
    // Register core capabilities
    this.registerLocalCapabilities();
    
    console.log('A2A Communication Manager initialized');
  }
  
  /**
   * Register local capabilities with the A2A Hub
   */
  private registerLocalCapabilities(): void {
    this.a2aHub.registerCapabilities([
      {
        capability: 'agent-coordination',
        version: '1.1',
        description: 'Coordinate agents for task execution',
      },
      {
        capability: 'council-deliberation',
        version: '1.0',
        description: 'Facilitate council-based decision making',
      },
      {
        capability: 'knowledge-validation',
        version: '1.2',
        description: 'Validate and verify knowledge and facts',
      }
    ]);
    
    console.log('Registered local capabilities with A2A Hub');
  }
  
  /**
   * Send a message to an agent via A2A protocol
   */
  public async sendMessage(
    recipientId: string,
    content: any,
    options: A2AMessageOptions = {}
  ): Promise<any> {
    try {
      const response = await this.a2aHub.sendMessage(
        recipientId,
        content,
        options
      );
      
      return response.body.content;
    } catch (error) {
      console.error('Error sending A2A message:', error);
      throw new Error(`A2A communication error: ${(error as Error).message}`);
    }
  }
  
  /**
   * Discover available A2A capabilities across the network
   */
  public async discoverCapabilities(): Promise<{ capability: string; provider: string }[]> {
    const capabilities = await this.a2aHub.discoverCapabilities();
    return capabilities.map(cap => ({
      capability: cap.capability,
      provider: cap.provider || 'unknown'
    }));
  }
  
  /**
   * Route a message to an agent with the required capability
   */
  public async routeByCapability(
    capability: string,
    content: any,
    options: Omit<A2AMessageOptions, 'requiredCapabilities'> = {}
  ): Promise<any> {
    try {
      const response = await this.a2aHub.routeMessageByCapability(
        capability,
        content,
        options
      );
      
      return response?.body.content;
    } catch (error) {
      console.error(`Error routing message by capability ${capability}:`, error);
      throw new Error(`A2A capability routing error: ${(error as Error).message}`);
    }
  }
  
  /**
   * Register an external agent with the hub
   */
  public registerExternalAgent(
    id: string,
    name: string,
    capabilities: string[],
    connectionType: 'remote' | 'p2p' = 'remote',
    url?: string
  ): void {
    this.a2aHub.registerAgent({
      id,
      name,
      capabilities: capabilities.map(cap => ({ capability: cap })),
      connectionType,
      url,
      trustLevel: 'medium'
    });
    
    console.log(`Registered external agent: ${name} (${id})`);
  }
  
  /**
   * Get the A2A Hub instance
   */
  public getA2AHub(): A2AHub {
    return this.a2aHub;
  }
  
  /**
   * Get the OAuth handler
   */
  public getOAuthHandler(): A2AOAuthHandler {
    return this.oauthHandler;
  }
  
  /**
   * Get the local agent ID
   */
  public getLocalAgentId(): string {
    return this.localAgentId;
  }
}
