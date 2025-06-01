
import { useCallback } from 'react';
import { liveSessionService, CreateSessionData } from '@/services/LiveSessionService';
import { ErrorHandler } from '@/utils/errorHandling';
import { toast } from 'sonner';

export const useLiveSessionOperations = () => {
  const createSession = useCallback(async (userId: string, sessionData: CreateSessionData) => {
    try {
      const result = await liveSessionService.createSession(userId, sessionData);
      if (!result.success || !result.data) {
        throw result.error || new Error('Failed to create session');
      }
      
      toast.success('Session created successfully');
      return result.data;
    } catch (error) {
      ErrorHandler.handle(error, { action: 'session-creation' });
      return null;
    }
  }, []);

  const joinSession = useCallback(async (sessionId: string, userId: string, accessCode?: string) => {
    try {
      const result = await liveSessionService.joinSession(sessionId, userId, accessCode);
      if (!result.success) {
        throw result.error || new Error('Failed to join session');
      }
      
      toast.success('Joined session successfully');
      return true;
    } catch (error) {
      ErrorHandler.handle(error, { action: 'session-joining' });
      return false;
    }
  }, []);

  const leaveSession = useCallback(async (sessionId: string, userId: string) => {
    try {
      const result = await liveSessionService.leaveSession(sessionId, userId);
      if (!result.success) {
        throw result.error || new Error('Failed to leave session');
      }
      
      toast.success('Left session successfully');
      return true;
    } catch (error) {
      ErrorHandler.handle(error, { action: 'session-leaving' });
      return false;
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const result = await liveSessionService.getActiveSessions();
      if (!result.success || !result.data) {
        throw result.error || new Error('Failed to fetch sessions');
      }
      
      return result.data;
    } catch (error) {
      ErrorHandler.handle(error, { action: 'sessions-fetching' });
      return [];
    }
  }, []);

  return {
    createSession,
    joinSession,
    leaveSession,
    fetchSessions
  };
};
