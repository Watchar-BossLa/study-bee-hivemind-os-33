
import { BaseService, ServiceResponse } from './base/BaseService';
import { supabase } from '@/integrations/supabase/client';
import { LiveSession } from '@/types/livesessions';

export interface CreateSessionData {
  title: string;
  description?: string;
  subject: string;
  maxParticipants: number;
  isPrivate: boolean;
  accessCode?: string;
  features: any;
}

export class LiveSessionService extends BaseService {
  constructor() {
    super({ retryAttempts: 2, timeout: 8000 });
  }

  async createSession(userId: string, sessionData: CreateSessionData): Promise<ServiceResponse<LiveSession>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          title: sessionData.title,
          description: sessionData.description,
          host_id: userId,
          subject: sessionData.subject,
          max_participants: sessionData.maxParticipants,
          is_private: sessionData.isPrivate,
          access_code: sessionData.accessCode,
          features: sessionData.features,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return this.transformSession(data);
    }, 'session-creation');
  }

  async getActiveSessions(): Promise<ServiceResponse<LiveSession[]>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.transformSession);
    }, 'sessions-fetching');
  }

  async joinSession(sessionId: string, userId: string, accessCode?: string): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      // Verify session exists and access code if needed
      const { data: session, error: sessionError } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      if (session.is_private && session.access_code !== accessCode) {
        throw new Error('Invalid access code');
      }

      // Join the session
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: userId,
          role: 'participant'
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }
    }, 'session-joining');
  }

  async leaveSession(sessionId: string, userId: string): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { error } = await supabase
        .from('session_participants')
        .update({ 
          is_active: false, 
          left_at: new Date().toISOString() 
        })
        .eq('session_id', sessionId)
        .eq('user_id', userId);

      if (error) throw error;
    }, 'session-leaving');
  }

  private transformSession(data: any): LiveSession {
    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      host: {
        id: data.host_id,
        name: 'Host User',
        role: 'host' as const,
        isActive: true,
        joinedAt: data.created_at,
        lastSeen: data.updated_at
      },
      participants: [],
      subject: data.subject,
      maxParticipants: data.max_participants,
      isPrivate: data.is_private,
      accessCode: data.access_code || undefined,
      status: data.status as 'active' | 'ended' | 'scheduled',
      features: data.features,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      startTime: data.start_time,
      endTime: data.end_time || undefined
    };
  }
}

export const liveSessionService = new LiveSessionService();
