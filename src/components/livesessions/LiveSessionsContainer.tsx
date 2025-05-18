
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveSessionView from './ActiveSessionView';
import JoinSessionTab from './tabs/JoinSessionTab';
import BrowseSessionsTab from './tabs/BrowseSessionsTab';
import CreateSessionTab from './tabs/CreateSessionTab';
import AuthenticationAlert from './AuthenticationAlert';
import { LiveSession } from '@/types/livesessions';
import { useToast } from "@/components/ui/use-toast";
import { useLiveSessions } from '@/hooks/useLiveSessions';
import { supabase } from '@/integrations/supabase/client';

const LiveSessionsContainer = () => {
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  
  const {
    sessions,
    isLoading,
    error,
    joinSession,
    createSession,
    leaveSession
  } = useLiveSessions();
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setIsAuthenticated(!!session);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);
  
  const handleJoinSession = async (sessionToJoin: LiveSession) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to join a session"
      });
      return;
    }
    
    const joinedSession = await joinSession(sessionToJoin.id);
    
    if (joinedSession) {
      setActiveSession(joinedSession);
      toast({
        title: "Session joined",
        description: `You've joined ${joinedSession.title}`,
      });
    }
  };
  
  const handleJoinById = async (sessionId: string, accessCode?: string) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to join a session"
      });
      return;
    }
    
    // Check if the session exists and access code is valid (if private)
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('live_sessions')
        .select('id, is_private, access_code')
        .eq('id', sessionId)
        .maybeSingle();
      
      if (sessionError || !sessionData) {
        toast({
          variant: "destructive",
          title: "Session not found",
          description: "Please check the session ID and try again"
        });
        return;
      }
      
      if (sessionData.is_private && sessionData.access_code !== accessCode) {
        toast({
          variant: "destructive",
          title: "Invalid access code",
          description: "Please check the access code and try again"
        });
        return;
      }
      
      const joinedSession = await joinSession(sessionId);
      
      if (joinedSession) {
        setActiveSession(joinedSession);
        toast({
          title: "Session joined",
          description: `You've joined ${joinedSession.title}`,
        });
      }
    } catch (err) {
      console.error("Error checking session:", err);
      toast({
        variant: "destructive",
        title: "Error joining session",
        description: "Please try again later"
      });
    }
  };
  
  const handleCreateSession = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create a session"
      });
      return;
    }
    
    const newSession = await createSession(sessionData);
    
    if (newSession) {
      setActiveSession(newSession);
      toast({
        title: "Session created",
        description: "Your study session has been created successfully",
      });
    }
  };
  
  const handleLeaveSession = async () => {
    if (!activeSession) return;
    
    const success = await leaveSession(activeSession.id);
    
    if (success) {
      setActiveSession(null);
      toast({
        title: "Session left",
        description: "You've left the study session",
      });
    }
  };
  
  const handleSignIn = async () => {
    // Redirect to login page or show modal
    window.location.href = "/login"; // Adjust as needed for your auth flow
  };

  if (activeSession) {
    return <ActiveSessionView session={activeSession} onLeave={handleLeaveSession} />;
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Live Study Sessions</h1>
      
      {!isAuthenticated && <AuthenticationAlert onSignIn={handleSignIn} />}
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="join">Join Session</TabsTrigger>
          <TabsTrigger value="browse">Browse Sessions</TabsTrigger>
          <TabsTrigger value="create">Create Session</TabsTrigger>
        </TabsList>
        
        <TabsContent value="join">
          <JoinSessionTab onJoin={handleJoinById} disabled={!isAuthenticated} />
        </TabsContent>
        
        <TabsContent value="browse">
          <BrowseSessionsTab 
            sessions={sessions}
            isLoading={isLoading} 
            error={error}
            onJoinSession={handleJoinSession} 
            disabled={!isAuthenticated}
          />
        </TabsContent>
        
        <TabsContent value="create">
          <CreateSessionTab onSessionCreated={handleCreateSession} disabled={!isAuthenticated} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveSessionsContainer;
