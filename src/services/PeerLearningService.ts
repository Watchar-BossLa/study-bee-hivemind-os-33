
import { BaseService, ServiceResponse } from './base/BaseService';
import { supabase } from '@/integrations/supabase/client';

export interface PeerConnection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined';
  subjects: string[];
  message?: string;
  created_at: string;
  updated_at: string;
  requester_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  recipient_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface CreatePeerConnectionData {
  recipient_id: string;
  subjects: string[];
  message?: string;
}

export class PeerLearningService extends BaseService {
  constructor() {
    super({ retryAttempts: 2, timeout: 10000 });
  }

  async createPeerConnection(data: CreatePeerConnectionData): Promise<ServiceResponse<PeerConnection>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const connectionData = {
        ...data,
        requester_id: user.id,
        status: 'pending' as const
      };

      const { data: connection, error } = await supabase
        .from('peer_connections')
        .insert(connectionData)
        .select()
        .single();

      if (error) throw error;
      return connection as PeerConnection;
    }, 'peer-connection-creation');
  }

  async getPeerConnections(): Promise<ServiceResponse<PeerConnection[]>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('peer_connections')
        .select(`
          *,
          requester_profile:profiles!peer_connections_requester_id_fkey(full_name, avatar_url),
          recipient_profile:profiles!peer_connections_recipient_id_fkey(full_name, avatar_url)
        `)
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as PeerConnection[];
    }, 'peer-connections-fetching');
  }

  async updatePeerConnection(connectionId: string, status: 'accepted' | 'declined'): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { error } = await supabase
        .from('peer_connections')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', connectionId);

      if (error) throw error;
    }, 'peer-connection-updating');
  }

  async findPeers(subjects?: string[]): Promise<ServiceResponse<any[]>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('profiles')
        .select('id, full_name, avatar_url, preferred_subjects, bio')
        .neq('id', user.id)
        .not('preferred_subjects', 'is', null);

      if (subjects && subjects.length > 0) {
        query = query.overlaps('preferred_subjects', subjects);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      return data || [];
    }, 'peers-searching');
  }
}

export const peerLearningService = new PeerLearningService();
