
import { A2AOAuthHandler } from './A2AOAuthHandler';
import { FrameworkManager } from '../core/FrameworkManager';

export type P2PConnectionType = 'webrtc' | 'websocket' | 'http';
export type P2PDiscoveryMethod = 'manual' | 'broadcast' | 'registry';
export type P2PEncryptionLevel = 'none' | 'tls' | 'e2e';

export interface P2PNodeInfo {
  id: string;
  name: string;
  capabilities: string[];
  connectionTypes: P2PConnectionType[];
  discoveryMethods: P2PDiscoveryMethod[];
  encryptionLevel: P2PEncryptionLevel;
  status: 'online' | 'offline' | 'connecting' | 'error';
}

export interface P2PMessage {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  type: 'agent_request' | 'agent_response' | 'discovery' | 'heartbeat';
  payload: any;
  timestamp: number;
  signature?: string;
}

/**
 * A2A P2P Hub - Advanced peering capabilities for Agent-to-Agent communication
 */
export class A2AP2PHub {
  private nodes: Map<string, P2PNodeInfo> = new Map();
  private connections: Map<string, WebSocket | RTCPeerConnection> = new Map();
  private messageHandlers: Map<string, (message: P2PMessage) => void> = new Map();
  private oauthHandler: A2AOAuthHandler;
  private frameworkManager?: FrameworkManager;
  private isRunning = false;
  
  constructor(oauthHandler: A2AOAuthHandler, frameworkManager?: FrameworkManager) {
    this.oauthHandler = oauthHandler;
    this.frameworkManager = frameworkManager;
  }
  
  /**
   * Start the P2P hub
   */
  public async start(port: number = 9090): Promise<void> {
    if (this.isRunning) {
      console.warn('A2A P2P Hub is already running');
      return;
    }
    
    console.log(`Starting A2A P2P Hub on port ${port}`);
    
    // Initialize discovery service
    await this.initializeDiscovery();
    
    // Start heartbeat mechanism
    this.startHeartbeat();
    
    this.isRunning = true;
    console.log('A2A P2P Hub started successfully');
  }
  
  /**
   * Stop the P2P hub
   */
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }
    
    console.log('Stopping A2A P2P Hub');
    
    // Close all connections
    for (const [nodeId, connection] of this.connections) {
      if (connection instanceof WebSocket) {
        connection.close();
      } else if (connection instanceof RTCPeerConnection) {
        connection.close();
      }
    }
    
    this.connections.clear();
    this.nodes.clear();
    this.isRunning = false;
    
    console.log('A2A P2P Hub stopped');
  }
  
  /**
   * Register a new P2P node
   */
  public async registerNode(nodeInfo: Omit<P2PNodeInfo, 'id'> & { id?: string }): Promise<string> {
    const nodeId = nodeInfo.id || `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const fullNodeInfo: P2PNodeInfo = {
      id: nodeId,
      name: nodeInfo.name,
      capabilities: nodeInfo.capabilities,
      connectionTypes: nodeInfo.connectionTypes,
      discoveryMethods: nodeInfo.discoveryMethods,
      encryptionLevel: nodeInfo.encryptionLevel,
      status: 'online'
    };
    
    this.nodes.set(nodeId, fullNodeInfo);
    
    console.log(`Registered P2P node: ${nodeId}`);
    
    // Broadcast node discovery to other nodes
    await this.broadcastDiscovery(fullNodeInfo);
    
    return nodeId;
  }
  
  /**
   * Unregister a P2P node
   */
  public async unregisterNode(nodeId: string): Promise<boolean> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return false;
    }
    
    // Close connection if exists
    const connection = this.connections.get(nodeId);
    if (connection) {
      if (connection instanceof WebSocket) {
        connection.close();
      } else if (connection instanceof RTCPeerConnection) {
        connection.close();
      }
      this.connections.delete(nodeId);
    }
    
    this.nodes.delete(nodeId);
    
    console.log(`Unregistered P2P node: ${nodeId}`);
    
    return true;
  }
  
  /**
   * Connect to a peer node
   */
  public async connectToPeer(nodeId: string, connectionType: P2PConnectionType = 'websocket'): Promise<boolean> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      console.error(`Node ${nodeId} not found`);
      return false;
    }
    
    if (this.connections.has(nodeId)) {
      console.warn(`Already connected to node ${nodeId}`);
      return true;
    }
    
    try {
      switch (connectionType) {
        case 'websocket':
          await this.connectWebSocket(nodeId, node);
          break;
        case 'webrtc':
          await this.connectWebRTC(nodeId, node);
          break;
        case 'http':
          // HTTP connections are stateless, no persistent connection needed
          console.log(`HTTP connection type selected for node ${nodeId}`);
          break;
        default:
          console.error(`Unsupported connection type: ${connectionType}`);
          return false;
      }
      
      node.status = 'online';
      console.log(`Connected to peer node: ${nodeId}`);
      return true;
      
    } catch (error) {
      console.error(`Failed to connect to peer node ${nodeId}:`, error);
      node.status = 'error';
      return false;
    }
  }
  
  /**
   * Send a message to a peer node
   */
  public async sendMessage(message: Omit<P2PMessage, 'id' | 'timestamp'>): Promise<boolean> {
    const fullMessage: P2PMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now()
    };
    
    // Add signature if required
    if (this.nodes.get(message.toNodeId)?.encryptionLevel !== 'none') {
      fullMessage.signature = await this.signMessage(fullMessage);
    }
    
    const connection = this.connections.get(message.toNodeId);
    if (!connection) {
      console.error(`No connection to node ${message.toNodeId}`);
      return false;
    }
    
    try {
      if (connection instanceof WebSocket) {
        connection.send(JSON.stringify(fullMessage));
      } else {
        // Handle WebRTC data channel
        const dataChannel = (connection as any).dataChannel;
        if (dataChannel && dataChannel.readyState === 'open') {
          dataChannel.send(JSON.stringify(fullMessage));
        } else {
          throw new Error('WebRTC data channel not ready');
        }
      }
      
      console.log(`Sent message ${fullMessage.id} to node ${message.toNodeId}`);
      return true;
      
    } catch (error) {
      console.error(`Failed to send message to node ${message.toNodeId}:`, error);
      return false;
    }
  }
  
  /**
   * Register a message handler
   */
  public onMessage(type: string, handler: (message: P2PMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }
  
  /**
   * Get all connected nodes
   */
  public getConnectedNodes(): P2PNodeInfo[] {
    return Array.from(this.nodes.values()).filter(node => node.status === 'online');
  }
  
  /**
   * Get node information
   */
  public getNodeInfo(nodeId: string): P2PNodeInfo | undefined {
    return this.nodes.get(nodeId);
  }
  
  /**
   * Initialize discovery service
   */
  private async initializeDiscovery(): Promise<void> {
    console.log('Initializing P2P discovery service');
    
    // Set up discovery message handler
    this.onMessage('discovery', (message) => {
      const nodeInfo = message.payload as P2PNodeInfo;
      if (!this.nodes.has(nodeInfo.id)) {
        this.nodes.set(nodeInfo.id, nodeInfo);
        console.log(`Discovered new node: ${nodeInfo.id}`);
      }
    });
  }
  
  /**
   * Broadcast node discovery
   */
  private async broadcastDiscovery(nodeInfo: P2PNodeInfo): Promise<void> {
    const discoveryMessage: Omit<P2PMessage, 'id' | 'timestamp'> = {
      fromNodeId: nodeInfo.id,
      toNodeId: 'broadcast',
      type: 'discovery',
      payload: nodeInfo
    };
    
    // Send to all connected nodes
    for (const [connectedNodeId] of this.connections) {
      if (connectedNodeId !== nodeInfo.id) {
        await this.sendMessage({
          ...discoveryMessage,
          toNodeId: connectedNodeId
        });
      }
    }
  }
  
  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    setInterval(() => {
      for (const [nodeId] of this.connections) {
        this.sendMessage({
          fromNodeId: 'hub',
          toNodeId: nodeId,
          type: 'heartbeat',
          payload: { timestamp: Date.now() }
        });
      }
    }, 30000); // 30 seconds
  }
  
  /**
   * Connect via WebSocket
   */
  private async connectWebSocket(nodeId: string, node: P2PNodeInfo): Promise<void> {
    // In a real implementation, this would connect to the node's WebSocket server
    // For now, we simulate the connection
    console.log(`Establishing WebSocket connection to node ${nodeId}`);
    
    // Simulate WebSocket connection
    const mockWebSocket = {
      send: (data: string) => console.log(`WebSocket send to ${nodeId}:`, data),
      close: () => console.log(`WebSocket closed for ${nodeId}`),
      readyState: 1 // OPEN
    } as WebSocket;
    
    this.connections.set(nodeId, mockWebSocket);
  }
  
  /**
   * Connect via WebRTC
   */
  private async connectWebRTC(nodeId: string, node: P2PNodeInfo): Promise<void> {
    console.log(`Establishing WebRTC connection to node ${nodeId}`);
    
    // In a real implementation, this would set up WebRTC peer connection
    // For now, we simulate the connection
    const mockPeerConnection = {
      dataChannel: {
        send: (data: string) => console.log(`WebRTC send to ${nodeId}:`, data),
        readyState: 'open'
      },
      close: () => console.log(`WebRTC closed for ${nodeId}`)
    } as RTCPeerConnection;
    
    this.connections.set(nodeId, mockPeerConnection);
  }
  
  /**
   * Sign a message for authentication
   */
  private async signMessage(message: P2PMessage): Promise<string> {
    // In a real implementation, this would use cryptographic signing
    // For now, we return a simple hash
    const messageString = JSON.stringify({
      id: message.id,
      fromNodeId: message.fromNodeId,
      toNodeId: message.toNodeId,
      type: message.type,
      payload: message.payload,
      timestamp: message.timestamp
    });
    
    return btoa(messageString).substring(0, 32);
  }
  
  /**
   * Handle incoming message
   */
  private handleMessage(message: P2PMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    } else {
      console.warn(`No handler for message type: ${message.type}`);
    }
  }
}
