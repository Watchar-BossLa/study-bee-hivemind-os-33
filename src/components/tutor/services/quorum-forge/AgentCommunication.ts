
import { MCPCore } from '../core/MCPCore';
import { A2AHub } from '../frameworks/A2AHub';
import { A2ACommunicationManager } from './A2ACommunicationManager';

/**
 * Handles agent-to-agent communication in QuorumForge
 */
export class AgentCommunication {
  private mcpCore: MCPCore;
  private a2aHub: A2AHub;
  private a2aCommunicationManager: A2ACommunicationManager | null = null;
  
  constructor(mcpCore: MCPCore, a2aHub: A2AHub) {
    this.mcpCore = mcpCore;
    this.a2aHub = a2aHub;
    
    // Initialize A2A Communication Manager if MCP is available
    if (mcpCore) {
      this.a2aCommunicationManager = new A2ACommunicationManager(mcpCore);
    }
  }
  
  /**
   * Send a message from one agent to another
   * @param fromAgentId Source agent ID
   * @param toAgentId Target agent ID
   * @param message The message content
   */
  public async sendAgentMessage(
    fromAgentId: string,
    toAgentId: string,
    message: any
  ): Promise<string> {
    // If we have the enhanced A2A Communication Manager, use it
    if (this.a2aCommunicationManager) {
      try {
        const response = await this.a2aCommunicationManager.sendMessage(
          toAgentId,
          message,
          {
            correlationId: `msg_${Date.now()}`
          }
        );
        
        return `message_sent_${Date.now()}`;
      } catch (error) {
        console.error("Enhanced A2A communication failed, falling back to MCP:", error);
      }
    }
    
    // Fall back to the original MCP implementation
    return this.mcpCore.sendMessage({
      fromAgentId,
      toAgentId,
      content: message,
      type: 'direct'
    });
  }
  
  /**
   * Communicate with an external agent through A2A protocol
   * @param agentId External agent ID
   * @param message Message to send
   * @param capabilities Required capabilities
   */
  public async communicateWithExternalAgent(
    agentId: string, 
    message: string, 
    capabilities: string[]
  ): Promise<any> {
    // If we have the enhanced A2A Communication Manager, use it
    if (this.a2aCommunicationManager) {
      try {
        return await this.a2aCommunicationManager.sendMessage(
          agentId,
          message,
          { requiredCapabilities: capabilities }
        );
      } catch (error) {
        console.error("Enhanced A2A communication failed, falling back to Hub:", error);
      }
    }
    
    // Fall back to the original A2A Hub implementation
    try {
      const response = await this.a2aHub.sendMessage(agentId, message, {
        requiredCapabilities: capabilities
      });
      return response.body.content;
    } catch (error) {
      console.error("External agent communication failed:", error);
      throw new Error(`Failed to communicate with external agent: ${(error as Error).message}`);
    }
  }
  
  /**
   * Route a message to any agent with the required capability
   * @param capability The required capability
   * @param message The message content
   */
  public async routeMessageByCapability(
    capability: string,
    message: any
  ): Promise<any> {
    // If we have the enhanced A2A Communication Manager, use it
    if (this.a2aCommunicationManager) {
      try {
        return await this.a2aCommunicationManager.routeByCapability(capability, message);
      } catch (error) {
        console.error("Enhanced capability routing failed, falling back to Hub:", error);
      }
    }
    
    // Fall back to the original A2A Hub implementation
    const response = await this.a2aHub.routeMessageByCapability(capability, message);
    return response?.body.content;
  }
  
  /**
   * Discover available capabilities across all agents
   */
  public async discoverCapabilities(): Promise<string[]> {
    // If we have the enhanced A2A Communication Manager, use it
    if (this.a2aCommunicationManager) {
      try {
        const capabilitiesWithProviders = await this.a2aCommunicationManager.discoverCapabilities();
        return capabilitiesWithProviders.map(c => c.capability);
      } catch (error) {
        console.error("Enhanced capability discovery failed, falling back to Hub:", error);
      }
    }
    
    // Fall back to the original A2A Hub implementation
    const capabilities = await this.a2aHub.discoverCapabilities();
    return capabilities.map(cap => cap.capability);
  }
  
  /**
   * Get the A2A Communication Manager
   */
  public getA2ACommunicationManager(): A2ACommunicationManager | null {
    return this.a2aCommunicationManager;
  }
  
  /**
   * Set up an external agent for A2A communication
   */
  public registerExternalAgent(
    id: string,
    name: string,
    capabilities: string[],
    url?: string
  ): void {
    if (this.a2aCommunicationManager) {
      this.a2aCommunicationManager.registerExternalAgent(id, name, capabilities, 'remote', url);
    } else {
      // Fall back to the original A2A Hub implementation
      this.a2aHub.registerAgent({
        id,
        name,
        capabilities: capabilities.map(cap => ({ capability: cap })),
        url,
        connectionType: 'remote'
      });
    }
  }
}
