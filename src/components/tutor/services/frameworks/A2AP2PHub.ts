
import { Plan } from '../deliberation/types/voting-types';
import { SpecializedAgent } from '../../types/agents';

export interface AgentToAgentCommunication {
  initiateConnection(agent1: SpecializedAgent, agent2: SpecializedAgent): Promise<RTCPeerConnection>;
  sendMessage(connection: RTCPeerConnection, message: string): void;
  receiveMessage(connection: RTCPeerConnection): Promise<string>;
  closeConnection(connection: RTCPeerConnection): void;
  broadcastMessage(message: string, agents: SpecializedAgent[]): void;
  createDataChannel(connection: RTCPeerConnection, label: string): RTCDataChannel;
}

/**
 * Hub to manage agent-to-agent communication using WebRTC
 */
export class A2AP2PHub implements AgentToAgentCommunication {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private iceServers: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];

  constructor(iceServers?: RTCIceServer[]) {
    if (iceServers) {
      this.iceServers = iceServers;
    }
  }

  public async initiateConnection(agent1: SpecializedAgent, agent2: SpecializedAgent): Promise<RTCPeerConnection> {
    const connection = new RTCPeerConnection({ iceServers: this.iceServers });
    this.peerConnections.set(agent1.id, connection);
    return connection;
  }

  public createDataChannel(connection: RTCPeerConnection, label: string): RTCDataChannel {
    const dataChannel = connection.createDataChannel(label);
    this.dataChannels.set(label, dataChannel);
    return dataChannel;
  }

  public async connectToPeer(peerId: string): Promise<void> {
    try {
      const connection = new RTCPeerConnection({ iceServers: this.iceServers });
      this.peerConnections.set(peerId, connection);
      
      console.log(`Connecting to peer: ${peerId}`);
    } catch (error) {
      console.error('Error connecting to peer:', error);
      throw error;
    }
  }

  public async sendMessage(connection: RTCPeerConnection, message: string): Promise<void> {
    const dataChannel = this.dataChannels.get('default');
    if (connection.connectionState === 'connected' && dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(message);
    } else {
      console.warn('Connection not open or data channel not available.');
    }
  }

  public async receiveMessage(connection: RTCPeerConnection): Promise<string> {
    return new Promise((resolve, reject) => {
      const dataChannel = this.dataChannels.get('default');
      if (!dataChannel) {
        reject('Data channel is not available.');
        return;
      }

      dataChannel.onmessage = (event) => {
        resolve(event.data);
      };

      dataChannel.onerror = (error) => {
        reject(`Data channel error: ${error}`);
      };
    });
  }

  public closeConnection(connection: RTCPeerConnection): void {
    connection.close();
  }

  public broadcastMessage(message: string, agents: SpecializedAgent[]): void {
    agents.forEach(agent => {
      const connection = this.peerConnections.get(agent.id);
      if (connection) {
        this.sendMessage(connection, message);
      } else {
        console.warn(`No connection found for agent: ${agent.id}`);
      }
    });
  }
}
