
import { useState, useCallback } from 'react';
import { peerLearningService, PeerConnection, CreatePeerConnectionData } from '@/services/PeerLearningService';
import { ErrorHandler } from '@/utils/errorHandling';
import { toast } from 'sonner';

export const usePeerLearning = () => {
  const [connections, setConnections] = useState<PeerConnection[]>([]);
  const [peers, setPeers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConnections = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await peerLearningService.getPeerConnections();
      if (result.success && result.data) {
        setConnections(result.data);
      }
    } catch (error) {
      ErrorHandler.handle(error, { action: 'peer-connections-fetching' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const findPeers = useCallback(async (subjects?: string[]) => {
    setIsLoading(true);
    try {
      const result = await peerLearningService.findPeers(subjects);
      if (result.success && result.data) {
        setPeers(result.data);
      }
    } catch (error) {
      ErrorHandler.handle(error, { action: 'peers-searching' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConnection = useCallback(async (data: CreatePeerConnectionData) => {
    try {
      const result = await peerLearningService.createPeerConnection(data);
      if (result.success && result.data) {
        setConnections(prev => [result.data!, ...prev]);
        toast.success('Peer connection request sent!');
        return result.data;
      }
    } catch (error) {
      ErrorHandler.handle(error, { action: 'peer-connection-creation' });
      toast.error('Failed to send connection request');
    }
    return null;
  }, []);

  const updateConnection = useCallback(async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      const result = await peerLearningService.updatePeerConnection(connectionId, status);
      if (result.success) {
        setConnections(prev => 
          prev.map(conn => 
            conn.id === connectionId ? { ...conn, status } : conn
          )
        );
        toast.success(`Connection ${status}!`);
        return true;
      }
    } catch (error) {
      ErrorHandler.handle(error, { action: 'peer-connection-updating' });
      toast.error(`Failed to ${status} connection`);
    }
    return false;
  }, []);

  return {
    connections,
    peers,
    isLoading,
    fetchConnections,
    findPeers,
    createConnection,
    updateConnection
  };
};
