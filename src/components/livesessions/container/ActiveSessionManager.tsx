
import React, { useState, useEffect } from 'react';
import { LiveSession } from '@/types/livesessions';
import ActiveSessionView from '../ActiveSessionView';
import { useLiveSessions } from '@/hooks/useLiveSessions';

interface ActiveSessionManagerProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

/**
 * Manages the active session state and switching between browsing and active session view
 */
const ActiveSessionManager: React.FC<ActiveSessionManagerProps> = ({ children, isAuthenticated }) => {
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const { getSessionById, createSession, joinSession, leaveSession } = useLiveSessions();
  
  // Optional: recover active session from localStorage on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('activeSessionId');
    if (storedSessionId && isAuthenticated) {
      getSessionById(storedSessionId).then(session => {
        if (session) {
          setActiveSession(session);
        } else {
          // Clear invalid session ID
          localStorage.removeItem('activeSessionId');
        }
      });
    }
  }, [getSessionById, isAuthenticated]);
  
  // Handle join session
  const handleJoinSession = async (session: LiveSession) => {
    if (!isAuthenticated) return null;
    
    try {
      const joinedSession = await joinSession(session.id);
      if (joinedSession) {
        setActiveSession(joinedSession);
        localStorage.setItem('activeSessionId', joinedSession.id);
      }
      return joinedSession;
    } catch (error) {
      console.error('Failed to join session:', error);
      return null;
    }
  };
  
  // Handle join by ID
  const handleJoinById = async (sessionId: string, accessCode?: string) => {
    if (!isAuthenticated) return null;
    
    try {
      const joinedSession = await joinSession(sessionId);
      if (joinedSession) {
        setActiveSession(joinedSession);
        localStorage.setItem('activeSessionId', joinedSession.id);
      }
      return joinedSession;
    } catch (error) {
      console.error('Failed to join session by ID:', error);
      return null;
    }
  };
  
  // Handle create session
  const handleCreateSession = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    if (!isAuthenticated) return null;
    
    try {
      const newSession = await createSession(sessionData);
      if (newSession) {
        setActiveSession(newSession);
        localStorage.setItem('activeSessionId', newSession.id);
      }
      return newSession;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  };
  
  // Handle leave session
  const handleLeaveSession = async () => {
    if (activeSession) {
      try {
        await leaveSession(activeSession.id);
        localStorage.removeItem('activeSessionId');
        setActiveSession(null);
      } catch (error) {
        console.error('Failed to leave session:', error);
      }
    }
  };
  
  return (
    <>
      {activeSession ? (
        <ActiveSessionView 
          session={activeSession} 
          onLeaveSession={handleLeaveSession} 
        />
      ) : (
        React.cloneElement(
          children as React.ReactElement, 
          { 
            onJoinSession: handleJoinSession, 
            onJoinById: handleJoinById,
            onCreateSession: handleCreateSession
          }
        )
      )}
    </>
  );
};

export default ActiveSessionManager;
