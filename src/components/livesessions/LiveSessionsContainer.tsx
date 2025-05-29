
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LiveSession } from '@/types/livesessions';
import { sessionFeaturesToJson } from '@/utils/sessionFormatters';
import CreateSessionTab from './tabs/CreateSessionTab';
import JoinSessionTab from './tabs/JoinSessionTab';
import BrowseSessionsTab from './tabs/BrowseSessionsTab';
import ActiveSessionView from './ActiveSessionView';
import AuthenticationAlert from './AuthenticationAlert';
import SessionAuthManager from './container/SessionAuthManager';

const LiveSessionsContainer: React.FC = () => {
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedSessions: LiveSession[] = (data || []).map(session => ({
        id: session.id,
        title: session.title,
        description: session.description || undefined,
        host: {
          id: session.host_id,
          name: 'Host User', // In a real app, fetch from profiles
          role: 'host' as const,
          isActive: true,
          joinedAt: session.created_at,
          lastSeen: session.updated_at
        },
        participants: [], // Would be fetched separately
        subject: session.subject,
        maxParticipants: session.max_participants,
        isPrivate: session.is_private,
        accessCode: session.access_code || undefined,
        status: session.status as 'active' | 'ended' | 'scheduled',
        features: session.features as any,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        startTime: session.start_time,
        endTime: session.end_time || undefined
      }));
      
      setSessions(transformedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions');
      toast({
        title: 'Error',
        description: 'Failed to load live sessions',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCreateSession = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to create sessions',
          variant: 'destructive'
        });
        return;
      }

      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          title: sessionData.title,
          description: sessionData.description,
          host_id: user.id,
          subject: sessionData.subject,
          max_participants: sessionData.maxParticipants,
          is_private: sessionData.isPrivate,
          access_code: sessionData.accessCode,
          features: sessionFeaturesToJson(sessionData.features),
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Session created',
        description: 'Your live session has been created successfully',
      });

      await fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create session',
        variant: 'destructive'
      });
    }
  };

  const handleJoinSession = async (sessionId: string, accessCode?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to join sessions',
          variant: 'destructive'
        });
        return;
      }

      // Find the session
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        toast({
          title: 'Session not found',
          description: 'The requested session could not be found',
          variant: 'destructive'
        });
        return;
      }

      // Check access code for private sessions
      if (session.isPrivate && session.accessCode !== accessCode) {
        toast({
          title: 'Invalid access code',
          description: 'The access code you entered is incorrect',
          variant: 'destructive'
        });
        return;
      }

      // Join the session
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          role: 'participant'
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }

      setActiveSession(session);
      
      toast({
        title: 'Joined session',
        description: `You've joined "${session.title}"`,
      });
    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: 'Error',
        description: 'Failed to join session',
        variant: 'destructive'
      });
    }
  };

  const handleJoinSessionDirect = async (session: LiveSession) => {
    await handleJoinSession(session.id);
  };

  const handleLeaveSession = async () => {
    if (!activeSession) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('session_participants')
          .update({ is_active: false, left_at: new Date().toISOString() })
          .eq('session_id', activeSession.id)
          .eq('user_id', user.id);
      }

      setActiveSession(null);
      
      toast({
        title: 'Left session',
        description: 'You have left the session',
      });
    } catch (error) {
      console.error('Error leaving session:', error);
      toast({
        title: 'Error',
        description: 'Failed to leave session',
        variant: 'destructive'
      });
    }
  };

  return (
    <SessionAuthManager>
      {(isAuthenticated) => (
        <div className="space-y-6">
          {!isAuthenticated && (
            <AuthenticationAlert onSignIn={() => window.location.href = '/login'} />
          )}

          {activeSession ? (
            <ActiveSessionView 
              session={activeSession} 
              onLeaveSession={handleLeaveSession}
            />
          ) : (
            <Card className="p-6">
              <Tabs defaultValue="browse" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="browse">Browse Sessions</TabsTrigger>
                  <TabsTrigger value="join">Join by Code</TabsTrigger>
                  <TabsTrigger value="create">Create Session</TabsTrigger>
                </TabsList>

                <TabsContent value="browse">
                  <BrowseSessionsTab
                    sessions={sessions}
                    isLoading={isLoading}
                    error={error}
                    onJoinSession={handleJoinSessionDirect}
                    disabled={!isAuthenticated}
                  />
                </TabsContent>

                <TabsContent value="join">
                  <JoinSessionTab
                    onJoin={handleJoinSession}
                    disabled={!isAuthenticated}
                  />
                </TabsContent>

                <TabsContent value="create">
                  <CreateSessionTab
                    onSessionCreated={handleCreateSession}
                    disabled={!isAuthenticated}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </div>
      )}
    </SessionAuthManager>
  );
};

export default LiveSessionsContainer;
