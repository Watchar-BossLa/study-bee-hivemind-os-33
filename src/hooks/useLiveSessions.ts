
import { useState, useEffect, useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useSessionFetching } from './useSessionFetching';
import { useSessionActions } from './useSessionActions';

export function useLiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const { isLoading, error, fetchSessions, getSessionById } = useSessionFetching();
  const { createSession, joinSession, leaveSession } = useSessionActions();
  
  // Fetch sessions and update state
  const refreshSessions = useCallback(async () => {
    const data = await fetchSessions();
    setSessions(data);
  }, [fetchSessions]);
  
  // Initial data fetch
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);
  
  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('live-sessions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'live_sessions' 
        }, 
        () => {
          refreshSessions();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'session_participants' 
        }, 
        () => {
          refreshSessions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSessions]);

  // Enhanced version of createSession that fetches and returns the complete session
  const createSessionAndGet = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    const sessionId = await createSession(sessionData);
    if (sessionId) {
      return await getSessionById(sessionId);
    }
    return null;
  };

  // Enhanced version of joinSession that fetches and returns the complete session
  const joinSessionAndGet = async (sessionId: string, accessCode?: string) => {
    const joined = await joinSession(sessionId, accessCode);
    if (joined) {
      return await getSessionById(sessionId);
    }
    return null;
  };
  
  return {
    sessions,
    isLoading,
    error,
    getSessionById,
    createSession: createSessionAndGet,
    joinSession: joinSessionAndGet,
    leaveSession,
    refreshSessions
  };
}
