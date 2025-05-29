
import { useState, useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';
import { liveSessionService } from '@/services/LiveSessionService';

export function useSessionFetching() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async (): Promise<LiveSession[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await liveSessionService.getActiveSessions();
      if (!result.success || !result.data) {
        throw result.error || new Error('Failed to fetch sessions');
      }
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sessions';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSessionById = useCallback(async (sessionId: string): Promise<LiveSession | null> => {
    // This would typically be implemented in the service layer
    // For now, we'll simulate it by fetching all sessions and finding the one we want
    try {
      const sessions = await fetchSessions();
      return sessions.find(session => session.id === sessionId) || null;
    } catch (err) {
      console.error('Error fetching session by ID:', err);
      return null;
    }
  }, [fetchSessions]);

  return {
    isLoading,
    error,
    fetchSessions,
    getSessionById
  };
}
