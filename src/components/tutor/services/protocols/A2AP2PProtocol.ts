import { v4 as uuidv4 } from '@/lib/uuid';
import { A2AMessageType, A2ATransportProtocol, A2AErrorCode } from './A2AProtocol';

/**
 * A2A P2P Protocol - Extended peer-to-peer protocol for agent communication
 * Implements the a2a-p2p-hub feature from QuorumForge OS spec
 */

export enum P2PConnectionType {
  DIRECT = 'direct',
  RELAY = 'relay',
  HYBRID = 'hybrid'
}

export enum P2PDiscoveryMethod {
  BROADCAST = 'broadcast',
  REGISTRY = 'registry',
  INVITATION = 'invitation',
  MESH = 'mesh'
}

export enum P2PEncryptionLevel {
  NONE = 'none',
  BASIC = 'basic',
  FULL = 'full',
  END_TO_END = 'end_to_end'
}

export interface P2PNodeInfo {
  id: string;
  name: string;
  capabilities: string[];
  url?: string;
  connectionTypes: P2PConnectionType[];
  discoveryMethods: P2PDiscoveryMethod[];
  encryptionLevel: P2PEncryptionLevel;
  lastSeen?: Date;
  status: 'online' | 'offline' | 'busy' | 'away';
  trustScore?: number;
  networkLatency?: number;
}

export interface P2PMessageHeader {
  messageId: string;
  senderId: string;
  senderName?: string;
  recipientId: string;
  recipientName?: string;
  timestamp: string;
  messageType: A2AMessageType;
  transportProtocol: A2ATransportProtocol;
  correlationId?: string;
  ttl?: number;
  hops?: number;
  maxHops?: number;
  routingHint?: string[];
  signature?: string;
  encryptionLevel?: P2PEncryptionLevel;
}

export interface P2PMessageBody {
  content?: any;
  metadata?: string | Record<string, any>; // Allow both types for encryption compatibility
}

export interface P2PMessage {
  header: P2PMessageHeader;
  body: P2PMessageBody;
}

export interface P2PCapabilityInfo {
  capability: string;
  version: string;
  provider: string;
  description?: string;
  parameters?: Record<string, any>;
  requirements?: Record<string, any>;
  pricing?: {
    type: 'free' | 'metered' | 'subscription';
    details?: Record<string, any>;
  };
}

/**
 * A2A P2P Protocol implementation
 */
export class A2AP2PProtocol {
  private nodeId: string;
  private nodeName: string;
  private capabilities: P2PCapabilityInfo[] = [];
  private peers: Map<string, P2PNodeInfo> = new Map();
  private encryptionLevel: P2PEncryptionLevel;
  private signatureKey?: CryptoKey;
  private messageHandlers: Map<A2AMessageType, Set<(message: P2PMessage) => void>> = new Map();
  private directConnections: Set<string> = new Set();
  private relayConnections: Map<string, string> = new Map(); // peerID -> relayID
  
  constructor(nodeId?: string, nodeName?: string, encryptionLevel?: P2PEncryptionLevel) {
    this.nodeId = nodeId || uuidv4();
    this.nodeName = nodeName || `Node-${this.nodeId.substring(0, 8)}`;
    this.encryptionLevel = encryptionLevel || P2PEncryptionLevel.BASIC;
    
    console.log(`A2A P2P Protocol initialized for node ${this.nodeName} (${this.nodeId})`);
  }
  
  /**
   * Register a capability provided by this node
   */
  public registerCapability(capability: P2PCapabilityInfo): void {
    this.capabilities.push({
      ...capability,
      provider: capability.provider || this.nodeId
    });
  }
  
  /**
   * Register multiple capabilities at once
   */
  public registerCapabilities(capabilities: P2PCapabilityInfo[]): void {
    capabilities.forEach(cap => this.registerCapability(cap));
  }
  
  /**
   * Create a P2P message
   */
  public createMessage(
    recipientId: string,
    messageType: A2AMessageType,
    content: any,
    options: {
      recipientName?: string;
      correlationId?: string;
      routingHint?: string[];
      ttl?: number;
      maxHops?: number;
      metadata?: Record<string, any>;
      encryptionLevel?: P2PEncryptionLevel;
    } = {}
  ): P2PMessage {
    const messageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const message: P2PMessage = {
      header: {
        messageId,
        senderId: this.nodeId,
        senderName: this.nodeName,
        recipientId,
        recipientName: options.recipientName,
        timestamp,
        messageType,
        transportProtocol: A2ATransportProtocol.P2P,
        correlationId: options.correlationId,
        routingHint: options.routingHint,
        ttl: options.ttl || 300, // Default 5 minutes
        hops: 0,
        maxHops: options.maxHops || 5,
        encryptionLevel: options.encryptionLevel || this.encryptionLevel
      },
      body: {
        content,
        metadata: options.metadata
      }
    };
    
    return this.signMessage(message);
  }
  
  /**
   * Create a response to a P2P message
   */
  public createResponse(originalMessage: P2PMessage, content: any): P2PMessage {
    return this.createMessage(
      originalMessage.header.senderId,
      A2AMessageType.RESPONSE,
      content,
      {
        recipientName: originalMessage.header.senderName,
        correlationId: originalMessage.header.messageId,
        routingHint: originalMessage.header.routingHint,
        encryptionLevel: originalMessage.header.encryptionLevel
      }
    );
  }
  
  /**
   * Create an error response
   */
  public createErrorResponse(
    originalMessage: P2PMessage,
    errorCode: A2AErrorCode,
    errorMessage: string
  ): P2PMessage {
    return this.createMessage(
      originalMessage.header.senderId,
      A2AMessageType.ERROR,
      {
        error: {
          code: errorCode,
          message: errorMessage
        }
      },
      {
        recipientName: originalMessage.header.senderName,
        correlationId: originalMessage.header.messageId,
        routingHint: originalMessage.header.routingHint,
        encryptionLevel: originalMessage.header.encryptionLevel
      }
    );
  }
  
  /**
   * Sign a message (if signature key is available)
   */
  private signMessage(message: P2PMessage): P2PMessage {
    if (this.signatureKey) {
      // In a real implementation, this would cryptographically sign the message
      // For now, we'll simulate with a placeholder
      message.header.signature = `sig_${message.header.messageId}_${Date.now()}`;
    }
    
    return message;
  }
  
  /**
   * Encrypt message content based on encryption level
   */
  public encryptMessage(message: P2PMessage): P2PMessage {
    const encryptionLevel = message.header.encryptionLevel || this.encryptionLevel;
    
    // Clone the message to avoid modifying the original
    const encryptedMessage = JSON.parse(JSON.stringify(message)) as P2PMessage;
    
    switch (encryptionLevel) {
      case P2PEncryptionLevel.NONE:
        // No encryption
        return message;
        
      case P2PEncryptionLevel.BASIC:
        // Basic encryption (simulated)
        encryptedMessage.body = {
          content: `encrypted:basic:${JSON.stringify(message.body.content)}`,
          metadata: message.body.metadata
        };
        break;
        
      case P2PEncryptionLevel.FULL:
        // Full encryption (simulated)
        encryptedMessage.body = {
          content: `encrypted:full:${JSON.stringify(message.body.content)}`,
          metadata: `encrypted:full:${JSON.stringify(message.body.metadata)}`
        };
        break;
        
      case P2PEncryptionLevel.END_TO_END:
        // End-to-end encryption (simulated)
        encryptedMessage.body = {
          content: `encrypted:e2e:${message.header.recipientId}:${JSON.stringify(message.body.content)}`,
          metadata: `encrypted:e2e:${message.header.recipientId}:${JSON.stringify(message.body.metadata)}`
        };
        break;
    }
    
    return encryptedMessage;
  }
  
  /**
   * Decrypt message content
   */
  public decryptMessage(message: P2PMessage): P2PMessage {
    const encryptionLevel = message.header.encryptionLevel || P2PEncryptionLevel.NONE;
    
    // Clone the message to avoid modifying the original
    const decryptedMessage = JSON.parse(JSON.stringify(message)) as P2PMessage;
    
    // In a real implementation, this would use proper cryptography
    // For now, we'll simulate decryption by extracting the original content
    
    if (encryptionLevel !== P2PEncryptionLevel.NONE && typeof message.body.content === 'string') {
      if (message.body.content.startsWith('encrypted:')) {
        const parts = message.body.content.split(':');
        if (parts.length >= 3) {
          // Extract the encrypted content
          const encryptedContent = parts.slice(2).join(':');
          try {
            decryptedMessage.body.content = JSON.parse(encryptedContent);
          } catch (error) {
            console.error('Error decrypting message content:', error);
          }
        }
      }
      
      if (typeof message.body.metadata === 'string' && message.body.metadata.startsWith('encrypted:')) {
        const parts = message.body.metadata.split(':');
        if (parts.length >= 3) {
          // Extract the encrypted metadata
          const encryptedMetadata = parts.slice(2).join(':');
          try {
            decryptedMessage.body.metadata = JSON.parse(encryptedMetadata);
          } catch (error) {
            console.error('Error decrypting message metadata:', error);
          }
        }
      }
    }
    
    return decryptedMessage;
  }
  
  /**
   * Register a node as a peer
   */
  public registerPeer(peer: P2PNodeInfo): void {
    this.peers.set(peer.id, {
      ...peer,
      lastSeen: new Date()
    });
    
    console.log(`Registered peer: ${peer.name} (${peer.id})`);
  }
  
  /**
   * Get information about a peer
   */
  public getPeer(peerId: string): P2PNodeInfo | undefined {
    return this.peers.get(peerId);
  }
  
  /**
   * Get all peers
   */
  public getAllPeers(): P2PNodeInfo[] {
    return Array.from(this.peers.values());
  }
  
  /**
   * Handle an incoming message
   */
  public handleIncomingMessage(message: P2PMessage): P2PMessage | null {
    // Validate the message
    if (!this.validateMessage(message)) {
      return this.createErrorResponse(
        message,
        A2AErrorCode.INVALID_REQUEST,
        'Invalid message format or signature'
      );
    }
    
    // Check if message is expired
    if (this.isMessageExpired(message)) {
      return this.createErrorResponse(
        message,
        A2AErrorCode.TIMEOUT,
        'Message TTL expired'
      );
    }
    
    // Check if message is for us
    if (message.header.recipientId !== this.nodeId) {
      // Message is not for us, check if we should relay it
      if (message.header.hops !== undefined && 
          message.header.maxHops !== undefined && 
          message.header.hops < message.header.maxHops) {
        
        // Increment hops
        message.header.hops++;
        
        // In a real implementation, we would relay the message to the next hop
        console.log(`Relaying message ${message.header.messageId} from ${message.header.senderId} to ${message.header.recipientId}`);
        
        // Return null to indicate that we're handling the relaying
        return null;
      }
      
      // Message has reached max hops or doesn't have hop information
      return this.createErrorResponse(
        message,
        A2AErrorCode.NOT_FOUND,
        `Recipient ${message.header.recipientId} not found or unreachable`
      );
    }
    
    // Message is for us, decrypt it
    const decryptedMessage = this.decryptMessage(message);
    
    // Notify handlers
    const handlers = this.messageHandlers.get(message.header.messageType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(decryptedMessage);
        } catch (error) {
          console.error(`Error in message handler for ${message.header.messageType}:`, error);
        }
      });
    }
    
    // For request messages, create a default response
    if (message.header.messageType === A2AMessageType.REQUEST) {
      return this.createResponse(decryptedMessage, {
        status: 'received',
        timestamp: new Date().toISOString()
      });
    }
    
    // No response needed for other message types
    return null;
  }
  
  /**
   * Register a message handler
   */
  public onMessage(
    messageType: A2AMessageType, 
    handler: (message: P2PMessage) => void
  ): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    
    const handlers = this.messageHandlers.get(messageType)!;
    handlers.add(handler);
    
    // Return a function to unregister the handler
    return () => {
      handlers.delete(handler);
    };
  }
  
  /**
   * Validate a message
   */
  private validateMessage(message: P2PMessage): boolean {
    // Check required fields
    if (!message.header.messageId ||
        !message.header.senderId ||
        !message.header.recipientId ||
        !message.header.timestamp ||
        !message.header.messageType) {
      return false;
    }
    
    // Check signature if present
    if (message.header.signature) {
      // In a real implementation, this would verify the signature cryptographically
      // For now, we'll accept any signature that starts with "sig_"
      return message.header.signature.startsWith('sig_');
    }
    
    return true;
  }
  
  /**
   * Check if a message is expired based on TTL
   */
  private isMessageExpired(message: P2PMessage): boolean {
    if (!message.header.ttl) {
      return false;
    }
    
    const timestamp = new Date(message.header.timestamp);
    const ttlMs = message.header.ttl * 1000;
    const now = new Date();
    
    return now.getTime() - timestamp.getTime() > ttlMs;
  }
  
  /**
   * Establish a direct P2P connection with a peer
   */
  public establishDirectConnection(peerId: string): boolean {
    const peer = this.peers.get(peerId);
    if (!peer) {
      console.error(`Cannot establish connection: peer ${peerId} not found`);
      return false;
    }
    
    // In a real implementation, this would establish a WebRTC or similar connection
    console.log(`Establishing direct connection to peer ${peer.name} (${peerId})`);
    
    this.directConnections.add(peerId);
    
    // Update peer status
    peer.status = 'online';
    peer.lastSeen = new Date();
    this.peers.set(peerId, peer);
    
    return true;
  }
  
  /**
   * Establish a relay connection through another peer
   */
  public establishRelayConnection(peerId: string, relayPeerId: string): boolean {
    const peer = this.peers.get(peerId);
    const relayPeer = this.peers.get(relayPeerId);
    
    if (!peer) {
      console.error(`Cannot establish relay connection: peer ${peerId} not found`);
      return false;
    }
    
    if (!relayPeer) {
      console.error(`Cannot establish relay connection: relay peer ${relayPeerId} not found`);
      return false;
    }
    
    // In a real implementation, this would establish a relayed connection
    console.log(`Establishing relay connection to peer ${peer.name} (${peerId}) through ${relayPeer.name} (${relayPeerId})`);
    
    this.relayConnections.set(peerId, relayPeerId);
    
    return true;
  }
  
  /**
   * Check if we have a direct connection to a peer
   */
  public hasDirectConnection(peerId: string): boolean {
    return this.directConnections.has(peerId);
  }
  
  /**
   * Check if we have a relay connection to a peer
   */
  public hasRelayConnection(peerId: string): boolean {
    return this.relayConnections.has(peerId);
  }
  
  /**
   * Get the node ID
   */
  public getNodeId(): string {
    return this.nodeId;
  }
  
  /**
   * Get the node name
   */
  public getNodeName(): string {
    return this.nodeName;
  }
  
  /**
   * Create node info for this node
   */
  public getNodeInfo(): P2PNodeInfo {
    return {
      id: this.nodeId,
      name: this.nodeName,
      capabilities: this.capabilities.map(cap => cap.capability),
      connectionTypes: [P2PConnectionType.DIRECT, P2PConnectionType.RELAY],
      discoveryMethods: [P2PDiscoveryMethod.REGISTRY],
      encryptionLevel: this.encryptionLevel,
      status: 'online'
    };
  }
  
  /**
   * Get all capabilities offered by this node
   */
  public getCapabilities(): P2PCapabilityInfo[] {
    return [...this.capabilities];
  }
  
  /**
   * Set encryption level
   */
  public setEncryptionLevel(level: P2PEncryptionLevel): void {
    this.encryptionLevel = level;
    console.log(`Encryption level set to: ${level}`);
  }
}

export const createP2PProtocol = (
  nodeId?: string,
  nodeName?: string,
  encryptionLevel?: P2PEncryptionLevel
): A2AP2PProtocol => {
  return new A2AP2PProtocol(nodeId, nodeName, encryptionLevel);
};
