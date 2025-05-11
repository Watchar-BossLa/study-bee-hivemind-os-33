
import { MCPCore } from '../core/MCPCore';
import { A2AHub } from '../frameworks/A2AHub';

/**
 * Handles agent-to-agent communication in QuorumForge
 */
export class AgentCommunication {
  private mcpCore: MCPCore;
  private a2aHub: A2AHub;
  
  constructor(mcpCore: MCPCore, a2aHub: A2AHub) {
    this.mcpCore = mcpCore;
    this.a2aHub = a2aHub;
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
    const response = await this.a2aHub.routeMessageByCapability(capability, message);
    return response?.body.content;
  }
  
  /**
   * Discover available capabilities across all agents
   */
  public async discoverCapabilities(): Promise<string[]> {
    const capabilities = await this.a2aHub.discoverCapabilities();
    return capabilities.map(cap => cap.capability);
  }
}
