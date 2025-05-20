
import React, { useState } from 'react';
import AuthenticationAlert from './AuthenticationAlert';
import SessionAuthManager from './container/SessionAuthManager';
import ActiveSessionManager from './container/ActiveSessionManager';
import SessionTabs from './container/SessionTabs';
import { useToast } from "@/components/ui/use-toast";
import { useLiveSessions } from '@/hooks/useLiveSessions';
import { LiveSession } from '@/types/livesessions';

/**
 * Main container component for live sessions functionality
 */
const LiveSessionsContainer = () => {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const { 
    sessions, 
    isLoading, 
    error, 
    getSessionById, 
    createSession, 
    joinSession, 
    leaveSession, 
    refreshSessions 
  } = useLiveSessions();
  
  const handleSignIn = async () => {
    // Redirect to login page or show modal
    window.location.href = "/login"; // Adjust as needed for your auth flow
  };

  // Wrapper functions to handle session state
  const handleJoinSession = async (session: LiveSession) => {
    const result = await joinSession(session.id);
    if (result) {
      setActiveSession(result);
    }
    return result;
  };

  const handleJoinById = async (sessionId: string, accessCode?: string) => {
    const result = await joinSession(sessionId, accessCode);
    if (result) {
      const sessionData = await getSessionById(sessionId);
      if (sessionData) {
        setActiveSession(sessionData);
      }
    }
    return result;
  };

  const handleCreateSession = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    const result = await createSession(sessionData);
    if (result) {
      setActiveSession(result);
    }
    return result;
  };

  const handleLeaveSession = async () => {
    await leaveSession();
    setActiveSession(null);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Live Study Sessions</h1>
      
      <SessionAuthManager>
        {(isAuthenticated) => (
          <>
            {!isAuthenticated && (
              <AuthenticationAlert onSignIn={handleSignIn} />
            )}

            <ActiveSessionManager 
              isAuthenticated={isAuthenticated}
              session={activeSession} 
              leaveSession={handleLeaveSession}
              refreshSession={refreshSessions}
              isLoading={isLoading}
              error={error}
              children={
                <SessionTabs 
                  isAuthenticated={isAuthenticated} 
                  onJoinSession={handleJoinSession}
                  onJoinById={handleJoinById}
                  onCreateSession={handleCreateSession}
                />
              } 
            />
          </>
        )}
      </SessionAuthManager>
    </div>
  );
};

export default LiveSessionsContainer;
