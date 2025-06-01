
import { useCallback } from 'react';
import { liveSessionService, CreateSessionData } from '@/services/LiveSessionService';
import { ErrorHandler } from '@/utils/errorHandling';
import { toast } from 'sonner';

export function useSessionActions() {
  const createSession = useCallback(async (sessionData: CreateSessionData): Promise<string | null> => {
    try {
      // For now, simulate creating with a mock user ID
      // In a real app, this would get the current user ID from auth
      const mockUserId = 'user-123'; // This should come from auth context
      
      const result = await liveSessionService.createSession(mockUserId, sessionData);
      if (!result.success || !result.data) {
        throw result.error || new Error('Failed to create session');
      }
      
      toast.success('Session created successfully');
      return result.data.id;
    } catch (error) {
      ErrorHandler.handle(error, { action: 'session-creation' });
      toast.error('Failed to create session');
      return null;
    }
  }, []);

  const joinSession = useCallback(async (sessionId: string, accessCode?: string): Promise<boolean> => {
    try {
      // For now, simulate joining with a mock user ID
      const mockUserId = 'user-123'; // This should come from auth context
      
      const result = await liveSessionService.joinSession(sessionId, mockUserId, accessCode);
      if (!result.success) {
        throw result.error || new Error('Failed to join session');
      }
      
      toast.success('Joined session successfully');
      return true;
    } catch (error) {
      ErrorHandler.handle(error, { action: 'session-joining' });
      toast.error('Failed to join session');
      return false;
    }
  }, []);

  const leaveSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      // For now, simulate leaving with a mock user ID
      const mockUserId = 'user-123'; // This should come from auth context
      
      const result = await liveSessionService.leaveSession(sessionId, mockUserId);
      if (!result.success) {
        throw result.error || new Error('Failed to leave session');
      }
      
      toast.success('Left session successfully');
      return true;
    } catch (error) {
      ErrorHandler.handle(error, { action: 'session-leaving' });
      toast.error('Failed to leave session');
      return false;
    }
  }, []);

  return {
    createSession,
    joinSession,
    leaveSession
  };
}
