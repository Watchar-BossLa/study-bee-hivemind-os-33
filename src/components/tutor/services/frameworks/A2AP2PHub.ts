
import { 
  A2AP2PProtocol, 
  P2PNodeInfo, 
  P2PMessage, 
  P2PCapabilityInfo,
  P2PEncryptionLevel,
  P2PConnectionType,
  P2PDiscoveryMethod
} from '../protocols/A2AP2PProtocol';
import { RedisEventBus, redisEventBus } from '../core/RedisEventBus';
import { A2AMessageType, A2AErrorCode } from '../protocols/A2AProtocol';
import { v4 as uuidv4 } from '@/lib/uuid';
import { A2AOAuthHandler } from './A2AOAuthHandler';
import { MCPCore } from '../core/MCPCore';

export interface P2PRegistrationOptions {
  capabilities?: P2PCapabilityInfo[];
  discoveryMethods?: P2PDiscoveryMethod[];
  connectionTypes?: P2PConnectionType[];
  encryptionLevel?: P2PEncryptionLevel;
  metadata?: Record<string, any>;
}

/**
 * A2A P2P Hub - Manages peer-to-peer connections between agents
 * Implements the a2a-p2p-hub and a2a-auth0 features from QuorumForge OS spec
 */
export class A2AP2PHub {
  private protocol: A2AP2PProtocol;
  private eventBus: RedisEventBus;
  private oauthHandler: A2AOAuthHandler;
  private mcpCore?: MCPCore;
  private messageHandlers: Map<string, (message: P2PMessage) => void> = new Map();
  private capabilities: Map<string, P2PCapabilityInfo[]> = new Map();
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
    timer: NodeJS.Timeout;
  }> = new Map();
  
  constructor(
    hubId: string = uuidv4(),
    hubName: string = `P2PHub-${hubId.substring(0, 8)}`,
    oauthHandler: A2AOAuthHandler,
    eventBus?: RedisEventBus,
    mcpCore?: MCPCore
  ) {
    this.protocol = new A2AP2PProtocol(hubId, hubName, P2PEncryptionLevel.FULL);
    this.eventBus = eventBus || redisEventBus;
    this.oauthHandler = oauthHandler;
    this.mcpCore = mcpCore;
    
    this.setupEventListeners();
    this.setupDefaultCapabilities();
    
    console.log(`A2A P2P Hub initialized on secondary port with OAuth-PKCE security`);
  }
  
  /**
   * Set up event listeners for Redis events
   */
  private setupEventListeners(): void {
    // Listen for peer registrations
    this.eventBus.subscribe('p2p:peer:register', (peerInfo: P2PNodeInfo) => {
      // Add peer to our protocol
      this.protocol.registerPeer(peerInfo);
    });
    
    // Listen for P2P messages
    this.eventBus.subscribe('p2p:message', (message: P2PMessage) => {
      // Handle the message
      const response = this.protocol.handleIncomingMessage(message);
      
      // If there's a response, publish it
      if (response) {
        this.eventBus.publish('p2p:message', response).catch(err => {
          console.error('Error publishing P2P message response:', err);
        });
      }
      
      // If this message has a correlation ID and is a response, resolve the pending request
      if (message.header.correlationId && 
          (message.header.messageType === A2AMessageType.RESPONSE || 
           message.header.messageType === A2AMessageType.ERROR)) {
        const pending = this.pendingRequests.get(message.header.correlationId);
        if (pending) {
          if (message.header.messageType === A2AMessageType.ERROR) {
            pending.reject(message.body.content?.error || 'Unknown error');
          } else {
            pending.resolve(message);
          }
          
          clearTimeout(pending.timer);
          this.pendingRequests.delete(message.header.correlationId);
        }
      }
    });
    
    // Listen for capability updates
    this.eventBus.subscribe('p2p:capabilities', (data: {
      peerId: string;
      capabilities: P2PCapabilityInfo[];
    }) => {
      this.capabilities.set(data.peerId, data.capabilities);
    });
    
    // Set up message handlers
    this.protocol.onMessage(A2AMessageType.REQUEST, (message) => {
      const handler = this.messageHandlers.get(message.header.recipientId) || 
                      this.messageHandlers.get('*');
                      
      if (handler) {
        handler(message);
      }
    });
  }
  
  /**
   * Set up default capabilities for the hub
   */
  private setupDefaultCapabilities(): void {
    this.protocol.registerCapabilities([
      {
        capability: 'p2p.discovery',
        version: '1.0',
        provider: this.protocol.getNodeId(),
        description: 'Peer discovery service'
      },
      {
        capability: 'p2p.relay',
        version: '1.0',
        provider: this.protocol.getNodeId(),
        description: 'Message relay service'
      },
      {
        capability: 'p2p.registry',
        version: '1.0',
        provider: this.protocol.getNodeId(),
        description: 'Capability registry service'
      }
    ]);
  }
  
  /**
   * Register a new peer
   */
  public async registerPeer(peerInfo: Omit<P2PNodeInfo, 'id'> & { id?: string }): Promise<P2PNodeInfo> {
    // Generate ID if not provided
    const peerId = peerInfo.id || uuidv4();
    
    const peerRecord: P2PNodeInfo = {
      id: peerId,
      name: peerInfo.name,
      capabilities: peerInfo.capabilities,
      url: peerInfo.url,
      connectionTypes: peerInfo.connectionTypes || [P2PConnectionType.DIRECT],
      discoveryMethods: peerInfo.discoveryMethods || [P2PDiscoveryMethod.REGISTRY],
      encryptionLevel: peerInfo.encryptionLevel || P2PEncryptionLevel.BASIC,
      status: 'online',
      lastSeen: new Date()
    };
    
    // Register peer in our protocol
    this.protocol.registerPeer(peerRecord);
    
    // Publish peer registration
    await this.eventBus.publish('p2p:peer:register', peerRecord);
    
    return peerRecord;
  }
  
  /**
   * Register an agent with the P2P network
   */
  public async registerAgent(
    agent: {
      id: string;
      name: string;
      capabilities?: any[];
    },
    options?: P2PRegistrationOptions
  ): Promise<P2PNodeInfo> {
    // Convert capabilities to P2P capability format
    const capabilities = options?.capabilities || 
      (agent.capabilities || []).map(cap => ({
        capability: typeof cap === 'string' ? cap : cap.capability,
        version: '1.0',
        provider: agent.id,
        description: `Capability provided by ${agent.name}`
      }));
    
    // Register peer
    const peerInfo = await this.registerPeer({
      id: agent.id,
      name: agent.name,
      capabilities: capabilities.map(c => c.capability),
      connectionTypes: options?.connectionTypes || [P2PConnectionType.DIRECT],
      discoveryMethods: options?.discoveryMethods || [P2PDiscoveryMethod.REGISTRY],
      encryptionLevel: options?.encryptionLevel || P2PEncryptionLevel.BASIC
    });
    
    // Store detailed capabilities
    this.capabilities.set(agent.id, capabilities);
    await this.eventBus.publish('p2p:capabilities', {
      peerId: agent.id,
      capabilities
    });
    
    return peerInfo;
  }
  
  /**
   * Send a message to a peer
   */
  public async sendMessage(
    recipientId: string,
    content: any,
    options: {
      messageType?: A2AMessageType;
      correlationId?: string;
      ttl?: number;
      metadata?: Record<string, any>;
      requireCapabilities?: string[];
      timeout?: number;
    } = {}
  ): Promise<P2PMessage> {
    // Check if recipient is registered
    const peer = this.protocol.getPeer(recipientId);
    if (!peer) {
      throw new Error(`Peer ${recipientId} not found`);
    }
    
    // Check capabilities if required
    if (options.requireCapabilities && options.requireCapabilities.length > 0) {
      const peerCapabilities = this.capabilities.get(recipientId) || [];
      const hasAllCapabilities = options.requireCapabilities.every(
        required => peerCapabilities.some(cap => cap.capability === required)
      );
      
      if (!hasAllCapabilities) {
        throw new Error(`Peer ${recipientId} does not have all required capabilities`);
      }
    }
    
    // Check authorization with OAuth handler
    if (this.oauthHandler) {
      try {
        await this.oauthHandler.validateAccess(this.protocol.getNodeId(), recipientId);
      } catch (error) {
        throw new Error(`Authorization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Create message
    const message = this.protocol.createMessage(
      recipientId,
      options.messageType || A2AMessageType.REQUEST,
      content,
      {
        recipientName: peer.name,
        correlationId: options.correlationId,
        ttl: options.ttl,
        metadata: options.metadata
      }
    );
    
    // Encrypt the message
    const encryptedMessage = this.protocol.encryptMessage(message);
    
    // Publish message to event bus
    await this.eventBus.publish('p2p:message', encryptedMessage);
    
    // If this is not a request or no timeout is specified, return the sent message
    if (options.messageType !== A2AMessageType.REQUEST && options.messageType !== undefined || !options.timeout) {
      return message;
    }
    
    // For requests, wait for a response
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || 30000; // Default 30 seconds
      
      const timer = setTimeout(() => {
        this.pendingRequests.delete(message.header.messageId);
        reject(new Error(`Request to ${peer.name} (${recipientId}) timed out after ${timeout}ms`));
      }, timeout);
      
      this.pendingRequests.set(message.header.messageId, {
        resolve,
        reject,
        timer
      });
    });
  }
  
  /**
   * Register a message handler
   */
  public registerMessageHandler(
    agentId: string | '*',
    handler: (message: P2PMessage) => void
  ): void {
    this.messageHandlers.set(agentId, handler);
  }
  
  /**
   * Discover peers by capability
   */
  public async discoverPeersByCapability(capability: string): Promise<P2PNodeInfo[]> {
    const allPeers = this.protocol.getAllPeers();
    
    // Filter peers by capability
    return allPeers.filter(peer => 
      peer.capabilities.includes(capability)
    );
  }
  
  /**
   * Discover all capabilities in the network
   */
  public async discoverCapabilities(): Promise<P2PCapabilityInfo[]> {
    const allCapabilities: P2PCapabilityInfo[] = [];
    
    // Add capabilities from our protocol
    allCapabilities.push(...this.protocol.getCapabilities());
    
    // Add capabilities from other peers
    for (const [peerId, capabilities] of this.capabilities.entries()) {
      allCapabilities.push(...capabilities);
    }
    
    return allCapabilities;
  }
  
  /**
   * Integrate with MCP Core
   */
  public integrateMCPCore(mcpCore: MCPCore): void {
    this.mcpCore = mcpCore;
    
    // Register message handler to forward P2P messages to MCP
    this.registerMessageHandler('*', (message) => {
      if (this.mcpCore && message.header.messageType === A2AMessageType.REQUEST) {
        // Convert P2P message to MCP message
        const mcpMessage = {
          id: message.header.messageId,
          fromAgentId: message.header.senderId,
          toAgentId: message.header.recipientId,
          content: message.body.content,
          type: 'p2p_message',
          metadata: {
            ...message.body.metadata,
            p2p: {
              correlationId: message.header.correlationId,
              ttl: message.header.ttl,
              hops: message.header.hops
            }
          }
        };
        
        this.mcpCore.sendMessage(mcpMessage).catch(err => {
          console.error('Error forwarding P2P message to MCP:', err);
        });
      }
    });
    
    // Register MCP message handler to forward MCP messages to P2P
    if (this.mcpCore) {
      this.mcpCore.registerMessageHandler('*', (mcpMessage) => {
        if (mcpMessage.type === 'p2p_response') {
          // Convert MCP message to P2P response
          const p2pMessageId = mcpMessage.metadata?.p2p?.correlationId;
          
          if (p2pMessageId) {
            // Find the pending request
            const pending = this.pendingRequests.get(p2pMessageId);
            if (pending) {
              // Create a P2P response
              const responseMessage = this.protocol.createMessage(
                mcpMessage.fromAgentId,
                A2AMessageType.RESPONSE,
                mcpMessage.content,
                {
                  correlationId: p2pMessageId,
                  metadata: mcpMessage.metadata
                }
              );
              
              // Resolve the pending request
              pending.resolve(responseMessage);
              clearTimeout(pending.timer);
              this.pendingRequests.delete(p2pMessageId);
            }
          }
        }
      });
    }
    
    console.log('MCP Core integrated with A2A P2P Hub');
  }
  
  /**
   * Get the protocol instance
   */
  public getProtocol(): A2AP2PProtocol {
    return this.protocol;
  }
  
  /**
   * Get the OAuth handler
   */
  public getOAuthHandler(): A2AOAuthHandler {
    return this.oauthHandler;
  }
}

// Factory function to create a P2P Hub
export function createP2PHub(
  oauthHandler: A2AOAuthHandler,
  eventBus?: RedisEventBus,
  mcpCore?: MCPCore
): A2AP2PHub {
  const hubId = uuidv4();
  return new A2AP2PHub(hubId, `P2PHub-${hubId.substring(0, 8)}`, oauthHandler, eventBus, mcpCore);
}
