
import React, { useEffect } from 'react';
import ActiveSessionView from '../ActiveSessionView';
import { LiveSession } from '@/types/livesessions';
import { useToast } from '@/components/ui/use-toast';

interface ActiveSessionManagerProps {
  session: LiveSession | null;
  leaveSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  children?: React.ReactNode;
  isAuthenticated: boolean; // Add isAuthenticated prop
}

/**
 * Component that manages the active session view and handles session-specific actions
 */
const ActiveSessionManager: React.FC<ActiveSessionManagerProps> = ({
  session,
  leaveSession,
  refreshSession,
  isLoading,
  error,
  children,
  isAuthenticated // Handle the added prop
}) => {
  const { toast } = useToast();

  // Effect to refresh the session data periodically
  useEffect(() => {
    if (session) {
      const intervalId = setInterval(() => {
        refreshSession();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [session, refreshSession]);

  // Handle session errors
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Session Error",
        description: error
      });
    }
  }, [error, toast]);

  // Handle when a session ends
  useEffect(() => {
    if (session && session.status === 'ended') {
      toast({
        title: "Session Ended",
        description: "This study session has ended"
      });
    }
  }, [session, toast]);

  const handleLeaveSession = async () => {
    try {
      await leaveSession();
      toast({
        title: "Left Session",
        description: "You have left the study session"
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave the session"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
          <p className="mt-2">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-semibold mb-2">No Active Session</h2>
        <p className="text-muted-foreground">Join or create a session to get started</p>
        {children} {/* Render children when no session is active */}
      </div>
    );
  }

  return (
    <ActiveSessionView 
      session={session} 
      onLeaveSession={handleLeaveSession} 
    />
  );
};

export default ActiveSessionManager;
