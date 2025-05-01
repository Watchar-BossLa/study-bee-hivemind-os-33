
import { A2AOAuthHandler } from './A2AOAuthHandler';

interface ExternalAgent {
  id: string;
  name: string;
  capabilities: string[];
  url: string;
}

interface CapabilityAdvertisement {
  capability: string;
  description: string;
  parameters?: Record<string, any>;
}

export class AgentToAgentHub {
  private localCapabilities: CapabilityAdvertisement[] = [];
  private externalAgents: ExternalAgent[] = [];
  private activeConnections: Set<string> = new Set();
  private oauthHandler?: A2AOAuthHandler;
  
  constructor(oauthHandler?: A2AOAuthHandler) {
    this.oauthHandler = oauthHandler;
    // Initialize with mock external agents
    this.initializeMockAgents();
    console.log('A2A Hub initialized with OAuth-PKCE security');
  }
  
  private initializeMockAgents(): void {
    this.externalAgents = [
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
      }
    ];
  }
  
  public registerCapabilities(capabilities: string[]): void {
    this.localCapabilities = capabilities.map(cap => ({
      capability: cap,
      description: `Provider of ${cap} services`
    }));
    
    console.log(`Registered ${capabilities.length} capabilities with A2A Hub`);
  }
  
  public async discoverCapabilities(): Promise<CapabilityAdvertisement[]> {
    // In a real implementation, this would discover capabilities from other agents
    const externalCapabilities = this.externalAgents.flatMap(agent => 
      agent.capabilities.map(cap => ({
        capability: cap,
        description: `Provided by ${agent.name}`,
        provider: agent.id
      }))
    );
    
    return [...this.localCapabilities, ...externalCapabilities];
  }
  
  public async sendMessage(
    agentId: string,
    message: string,
    requiredCapabilities: string[] = []
  ): Promise<any> {
    // Find the external agent
    const agent = this.externalAgents.find(a => a.id === agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    
    // Check if the agent has the required capabilities
    const hasRequiredCapabilities = requiredCapabilities.every(cap => 
      agent.capabilities.includes(cap)
    );
    
    if (requiredCapabilities.length > 0 && !hasRequiredCapabilities) {
      throw new Error(`Agent ${agentId} does not have all required capabilities`);
    }
    
    // Get authentication headers if OAuth handler exists
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.oauthHandler) {
      headers = await this.oauthHandler.createAuthHeaders();
    }
    
    // Track the connection
    this.activeConnections.add(agentId);
    
    // Simulate message exchange
    console.log(`Sending message to external agent ${agentId}: ${message}`);
    
    // In a real implementation, this would make an actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate response
    const response = {
      agentId,
      message: `Response from ${agent.name} regarding: ${message.substring(0, 30)}...`,
      timestamp: new Date(),
      capabilities: agent.capabilities
    };
    
    // End the connection
    this.activeConnections.delete(agentId);
    
    return response;
  }
  
  public getActiveConnections(): string[] {
    return Array.from(this.activeConnections);
  }
  
  public getExternalAgents(): ExternalAgent[] {
    return this.externalAgents;
  }
}
