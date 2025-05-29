
import { useState, useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';

export const useLiveSessionState = () => {
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateActiveSession = useCallback((session: LiveSession | null) => {
    setActiveSession(session);
  }, []);

  const updateSessions = useCallback((newSessions: LiveSession[]) => {
    setSessions(newSessions);
  }, []);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
    }
  }, []);

  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  return {
    // State
    activeSession,
    sessions,
    isLoading,
    error,
    
    // Actions
    updateActiveSession,
    updateSessions,
    setLoadingState,
    setErrorState
  };
};
