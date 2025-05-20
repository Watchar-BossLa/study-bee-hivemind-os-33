import React, { useState } from 'react';
import { LiveSession } from '@/types/livesessions';
import { useLiveSessions } from '@/hooks/useLiveSessions';
import ActiveSessionView from '../ActiveSessionView';

interface ActiveSessionManagerProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

/**
 * Component to manage active session state and handling
 */
const ActiveSessionManager: React.FC<ActiveSessionManagerProps> = ({ 
  isAuthenticated, 
  children 
}) => {
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const { joinSession, createSession, leaveSession, getSessionById } = useLiveSessions();

  const handleJoinSession = async (sessionToJoin: LiveSession) => {
    if (!isAuthenticated) return null;
    
    const joinedSession = await joinSession(sessionToJoin.id);
    
    if (joinedSession) {
      setActiveSession(joinedSession);
      return joinedSession;
    }
    return null;
  };
  
  const handleJoinById = async (sessionId: string, accessCode?: string) => {
    if (!isAuthenticated) return null;
    
    const joinedSession = await joinSession(sessionId);
    
    if (joinedSession) {
      setActiveSession(joinedSession);
      return joinedSession;
    }
    return null;
  };
  
  const handleCreateSession = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    if (!isAuthenticated) return null;
    
    const newSession = await createSession(sessionData);
    
    if (newSession) {
      setActiveSession(newSession);
      return newSession;
    }
    return null;
  };
  
  const handleLeaveSession = async () => {
    if (!activeSession) return false;
    
    const success = await leaveSession(activeSession.id);
    
    if (success) {
      setActiveSession(null);
    }
    
    return success;
  };
  
  // If there's an active session, show it
  if (activeSession) {
    return <ActiveSessionView session={activeSession} onLeave={handleLeaveSession} />;
  }
  
  // Otherwise, pass session management functions to children
  return (
    <div>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onJoinSession: handleJoinSession, 
            onJoinById: handleJoinById, 
            onCreateSession: handleCreateSession
          });
        }
        return child;
      })}
    </div>
  );
};

export default ActiveSessionManager;
