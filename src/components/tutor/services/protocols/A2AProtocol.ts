
import { v4 as uuidv4 } from '@/lib/uuid';

/**
 * A2A Protocol Message Schema (v1.1)
 * Implements the Agent-to-Agent communication protocol as defined in QuorumForge OS spec
 */

export enum A2AMessageType {
  REQUEST = 'request',
  RESPONSE = 'response',
  ERROR = 'error',
  CAPABILITY_ADVERTISEMENT = 'capability_advertisement',
  DISCOVERY = 'discovery',
  HEARTBEAT = 'heartbeat',
  EVENT = 'event',
  STREAM_START = 'stream_start',
  STREAM_DATA = 'stream_data',
  STREAM_END = 'stream_end'
}

export enum A2ATransportProtocol {
  HTTP = 'http',
  WEBSOCKET = 'websocket',
  P2P = 'p2p',
  INTERNAL = 'internal'
}

export enum A2AErrorCode {
  INVALID_REQUEST = 'invalid_request',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  RATE_LIMITED = 'rate_limited',
  INTERNAL_ERROR = 'internal_error',
  SERVICE_UNAVAILABLE = 'service_unavailable',
  TIMEOUT = 'timeout'
}

export interface A2AMessageHeader {
  version: string;
  messageId: string;
  timestamp: string;
  sender: {
    id: string;
    name?: string;
    type?: string;
  };
  recipient: {
    id: string;
    name?: string;
    type?: string;
  };
  correlationId?: string;
  messageType: A2AMessageType;
  transportProtocol: A2ATransportProtocol;
  signature?: string;
  ttl?: number;
}

export interface A2AMessageBody {
  content?: any;
  metadata?: Record<string, any>;
}

export interface A2AErrorBody extends A2AMessageBody {
  error: {
    code: A2AErrorCode;
    message: string;
    details?: any;
  };
}

export interface A2ACapabilityBody extends A2AMessageBody {
  capabilities: Array<{
    id: string;
    name: string;
    description?: string;
    version?: string;
    parameters?: Record<string, any>;
    requirements?: Record<string, any>;
  }>;
}

export interface A2AMessage {
  header: A2AMessageHeader;
  body: A2AMessageBody;
}

/**
 * A2A Protocol class provides utilities for creating and validating A2A messages
 */
export class A2AProtocol {
  private version = '1.1.0';
  private signatureKey?: CryptoKey;
  private agentId: string;
  private agentName: string;
  
  constructor(agentId: string, agentName: string, signatureKey?: CryptoKey) {
    this.agentId = agentId;
    this.agentName = agentName;
    this.signatureKey = signatureKey;
  }
  
  /**
   * Create a new A2A message
   */
  public createMessage(
    recipientId: string, 
    messageType: A2AMessageType,
    content: any,
    options: {
      recipientName?: string;
      correlationId?: string;
      transportProtocol?: A2ATransportProtocol;
      ttl?: number;
      metadata?: Record<string, any>;
    } = {}
  ): A2AMessage {
    const messageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const message: A2AMessage = {
      header: {
        version: this.version,
        messageId,
        timestamp,
        sender: {
          id: this.agentId,
          name: this.agentName
        },
        recipient: {
          id: recipientId,
          name: options.recipientName
        },
        correlationId: options.correlationId,
        messageType,
        transportProtocol: options.transportProtocol || A2ATransportProtocol.HTTP,
        ttl: options.ttl
      },
      body: {
        content,
        metadata: options.metadata
      }
    };
    
    // If we have a signature key, sign the message
    if (this.signatureKey) {
      // In a real implementation, this would cryptographically sign the message
      // For now, we'll simulate with a placeholder
      message.header.signature = `sig_${messageId}_${Date.now()}`;
    }
    
    return message;
  }
  
  /**
   * Create a response to an existing message
   */
  public createResponse(
    originalMessage: A2AMessage, 
    content: any,
    metadata?: Record<string, any>
  ): A2AMessage {
    return this.createMessage(
      originalMessage.header.sender.id,
      A2AMessageType.RESPONSE,
      content,
      {
        recipientName: originalMessage.header.sender.name,
        correlationId: originalMessage.header.messageId,
        transportProtocol: originalMessage.header.transportProtocol,
        metadata
      }
    );
  }
  
  /**
   * Create an error response
   */
  public createErrorResponse(
    originalMessage: A2AMessage,
    errorCode: A2AErrorCode,
    errorMessage: string,
    details?: any
  ): A2AMessage {
    const errorBody: A2AErrorBody = {
      error: {
        code: errorCode,
        message: errorMessage,
        details
      }
    };
    
    return {
      header: {
        version: this.version,
        messageId: uuidv4(),
        timestamp: new Date().toISOString(),
        sender: {
          id: this.agentId,
          name: this.agentName
        },
        recipient: {
          id: originalMessage.header.sender.id,
          name: originalMessage.header.sender.name
        },
        correlationId: originalMessage.header.messageId,
        messageType: A2AMessageType.ERROR,
        transportProtocol: originalMessage.header.transportProtocol
      },
      body: errorBody
    };
  }
  
  /**
   * Advertise capabilities
   */
  public createCapabilityAdvertisement(
    recipientId: string,
    capabilities: Array<{
      id: string;
      name: string;
      description?: string;
      version?: string;
      parameters?: Record<string, any>;
      requirements?: Record<string, any>;
    }>,
    recipientName?: string
  ): A2AMessage {
    const capabilityBody: A2ACapabilityBody = {
      capabilities
    };
    
    return {
      header: {
        version: this.version,
        messageId: uuidv4(),
        timestamp: new Date().toISOString(),
        sender: {
          id: this.agentId,
          name: this.agentName
        },
        recipient: {
          id: recipientId,
          name: recipientName
        },
        messageType: A2AMessageType.CAPABILITY_ADVERTISEMENT,
        transportProtocol: A2ATransportProtocol.HTTP
      },
      body: capabilityBody
    };
  }
  
  /**
   * Validate an incoming message
   */
  public validateMessage(message: A2AMessage): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];
    
    // Check required fields
    if (!message.header.messageId) errors.push('Missing message ID');
    if (!message.header.timestamp) errors.push('Missing timestamp');
    if (!message.header.sender?.id) errors.push('Missing sender ID');
    if (!message.header.recipient?.id) errors.push('Missing recipient ID');
    if (!message.header.messageType) errors.push('Missing message type');
    if (!message.header.transportProtocol) errors.push('Missing transport protocol');
    
    // Check if recipient matches this agent
    if (message.header.recipient?.id !== this.agentId) {
      errors.push(`Message recipient ID ${message.header.recipient?.id} doesn't match this agent's ID ${this.agentId}`);
    }
    
    // Check message signature if present
    if (message.header.signature && this.signatureKey) {
      // In a real implementation, we would verify the signature cryptographically
      if (!message.header.signature.startsWith('sig_')) {
        errors.push('Invalid signature format');
      }
    }
    
    // Check message TTL if present
    if (message.header.ttl) {
      const messageTime = new Date(message.header.timestamp).getTime();
      const currentTime = Date.now();
      const ttlMs = message.header.ttl * 1000;
      
      if (currentTime - messageTime > ttlMs) {
        errors.push(`Message expired: TTL was ${message.header.ttl}s, but message is ${(currentTime - messageTime) / 1000}s old`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
  
  /**
   * Extract capabilities from a capability advertisement message
   */
  public extractCapabilities(message: A2AMessage): Array<{
    id: string;
    name: string;
    description?: string;
    version?: string;
    parameters?: Record<string, any>;
    requirements?: Record<string, any>;
  }> | null {
    if (message.header.messageType !== A2AMessageType.CAPABILITY_ADVERTISEMENT) {
      return null;
    }
    
    const capabilityBody = message.body as A2ACapabilityBody;
    return capabilityBody.capabilities;
  }
}

// Create a factory function for the A2A Protocol
export function createA2AProtocol(agentId: string, agentName: string): A2AProtocol {
  return new A2AProtocol(agentId, agentName);
}
