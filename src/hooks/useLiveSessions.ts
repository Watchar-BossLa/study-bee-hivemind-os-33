import { useState, useEffect, useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from '@/lib/uuid';
import { useToast } from "@/components/ui/use-toast";

export function useLiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch all live sessions from Supabase
  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('live_sessions')
        .select(`
          id, 
          title, 
          description, 
          subject, 
          start_time, 
          end_time, 
          status, 
          is_private, 
          access_code, 
          features, 
          created_at, 
          updated_at,
          max_participants,
          host_id
        `)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      // For each session, fetch the host details and participants
      if (data) {
        const sessionsWithParticipants = await Promise.all(data.map(async (session) => {
          // Fetch host details from profiles
          const { data: hostData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', session.host_id)
            .single();
          
          // Fetch participants
          const { data: participantsData } = await supabase
            .from('session_participants')
            .select(`
              user_id,
              profiles:user_id (id, full_name, avatar_url)
            `)
            .eq('session_id', session.id);
          
          const host = hostData ? {
            id: hostData.id,
            name: hostData.full_name || 'Unknown User',
            avatar: hostData.avatar_url || undefined
          } : {
            id: session.host_id,
            name: 'Unknown User',
            avatar: undefined
          };
          
          const participants = participantsData ? participantsData.map(p => ({
            id: p.profiles.id,
            name: p.profiles.full_name || 'Unknown User',
            avatar: p.profiles.avatar_url || undefined
          })) : [];
          
          // Add host to participants if not already included
          if (!participants.some(p => p.id === host.id)) {
            participants.push(host);
          }
          
          return {
            id: session.id,
            title: session.title,
            description: session.description || undefined,
            subject: session.subject,
            host,
            participants,
            maxParticipants: session.max_participants,
            startTime: session.start_time,
            endTime: session.end_time || undefined,
            status: session.status as 'scheduled' | 'active' | 'ended',
            isPrivate: session.is_private,
            accessCode: session.access_code || undefined,
            features: session.features,
            createdAt: session.created_at,
            updatedAt: session.updated_at
          } as LiveSession;
        }));
        
        setSessions(sessionsWithParticipants);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions");
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error loading sessions",
        description: "Please try again later."
      });
    }
  }, [toast]);
  
  // Initial data fetch
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);
  
  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('live-sessions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'live_sessions' 
        }, 
        () => {
          fetchSessions();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'session_participants' 
        }, 
        () => {
          fetchSessions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);
  
  const getSessionById = useCallback(async (id: string) => {
    try {
      // First check if we already have it in state
      const existingSession = sessions.find(session => session.id === id);
      if (existingSession) return existingSession;
      
      // Otherwise fetch from Supabase
      const { data, error: fetchError } = await supabase
        .from('live_sessions')
        .select(`
          id, 
          title, 
          description, 
          subject, 
          start_time, 
          end_time, 
          status, 
          is_private, 
          access_code, 
          features, 
          created_at, 
          updated_at,
          max_participants,
          host_id
        `)
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!data) return null;
      
      // Fetch host details
      const { data: hostData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', data.host_id)
        .single();
      
      // Fetch participants
      const { data: participantsData } = await supabase
        .from('session_participants')
        .select(`
          user_id,
          profiles:user_id (id, full_name, avatar_url)
        `)
        .eq('session_id', data.id);
      
      const host = hostData ? {
        id: hostData.id,
        name: hostData.full_name || 'Unknown User',
        avatar: hostData.avatar_url || undefined
      } : {
        id: data.host_id,
        name: 'Unknown User',
        avatar: undefined
      };
      
      const participants = participantsData ? participantsData.map(p => ({
        id: p.profiles.id,
        name: p.profiles.full_name || 'Unknown User',
        avatar: p.profiles.avatar_url || undefined
      })) : [];
      
      // Add host to participants if not already included
      if (!participants.some(p => p.id === host.id)) {
        participants.push(host);
      }
      
      const session: LiveSession = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        subject: data.subject,
        host,
        participants,
        maxParticipants: data.max_participants,
        startTime: data.start_time,
        endTime: data.end_time || undefined,
        status: data.status as 'scheduled' | 'active' | 'ended',
        isPrivate: data.is_private,
        accessCode: data.access_code || undefined,
        features: data.features,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      return session;
    } catch (err) {
      console.error("Error fetching session by ID:", err);
      toast({
        variant: "destructive",
        title: "Error loading session",
        description: "Could not load the requested session."
      });
      return null;
    }
  }, [sessions, toast]);
  
  const createSession = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    try {
      const user = supabase.auth.getSession();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to create a session"
        });
        return null;
      }
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to create a session"
        });
        return null;
      }
      
      const userId = userData.user.id;
      
      // Insert session into database
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          title: sessionData.title,
          description: sessionData.description,
          subject: sessionData.subject,
          max_participants: sessionData.maxParticipants,
          start_time: new Date().toISOString(),
          status: sessionData.status,
          is_private: sessionData.isPrivate,
          access_code: sessionData.accessCode,
          features: sessionData.features,
          host_id: userId
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Add host as participant
      await supabase
        .from('session_participants')
        .insert({
          session_id: data.id,
          user_id: userId,
          role: 'host'
        });
      
      toast({
        title: "Session created",
        description: "Your study session has been created successfully"
      });
      
      // Fetch the newly created session
      const newSession = await getSessionById(data.id);
      return newSession;
    } catch (err) {
      console.error("Error creating session:", err);
      toast({
        variant: "destructive",
        title: "Error creating session",
        description: "Failed to create study session"
      });
      return null;
    }
  };
  
  const joinSession = async (sessionId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to join a session"
        });
        return null;
      }
      
      const userId = userData.user.id;
      
      // Check if session exists and has capacity
      const { data: sessionData, error: sessionError } = await supabase
        .from('live_sessions')
        .select('id, max_participants')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;
      
      // Check participant count
      const { data: participants, error: participantsError } = await supabase
        .from('session_participants')
        .select('id')
        .eq('session_id', sessionId);
      
      if (participantsError) throw participantsError;
      
      if (participants && participants.length >= sessionData.max_participants) {
        toast({
          variant: "destructive",
          title: "Session full",
          description: "This session has reached maximum capacity"
        });
        return null;
      }
      
      // Check if user is already a participant
      const { data: existingParticipant } = await supabase
        .from('session_participants')
        .select('id, is_active')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existingParticipant) {
        // If already a participant but inactive, reactivate
        if (!existingParticipant.is_active) {
          await supabase
            .from('session_participants')
            .update({
              is_active: true,
              left_at: null
            })
            .eq('id', existingParticipant.id);
        }
      } else {
        // Add as new participant
        await supabase
          .from('session_participants')
          .insert({
            session_id: sessionId,
            user_id: userId,
            role: 'participant'
          });
      }
      
      toast({
        title: "Session joined",
        description: "You've joined the study session"
      });
      
      // Fetch the updated session
      const updatedSession = await getSessionById(sessionId);
      return updatedSession;
    } catch (err) {
      console.error("Error joining session:", err);
      toast({
        variant: "destructive",
        title: "Error joining session",
        description: "Failed to join study session"
      });
      return null;
    }
  };
  
  const leaveSession = async (sessionId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return false;
      }
      
      const userId = userData.user.id;
      
      // Find the participant record
      const { data: participantData, error: participantError } = await supabase
        .from('session_participants')
        .select('id, role')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (participantError) throw participantError;
      
      // Mark as inactive and set left time
      await supabase
        .from('session_participants')
        .update({
          is_active: false,
          left_at: new Date().toISOString()
        })
        .eq('id', participantData.id);
      
      // If host is leaving, end the session or transfer host role
      if (participantData.role === 'host') {
        // Find another active participant to make host
        const { data: nextHost } = await supabase
          .from('session_participants')
          .select('id, user_id')
          .eq('session_id', sessionId)
          .eq('is_active', true)
          .neq('user_id', userId)
          .limit(1)
          .maybeSingle();
        
        if (nextHost) {
          // Transfer host role
          await supabase
            .from('session_participants')
            .update({ role: 'host' })
            .eq('id', nextHost.id);
        } else {
          // End session if no other participants
          await supabase
            .from('live_sessions')
            .update({
              status: 'ended',
              end_time: new Date().toISOString()
            })
            .eq('id', sessionId);
        }
      }
      
      toast({
        title: "Session left",
        description: "You've left the study session"
      });
      
      return true;
    } catch (err) {
      console.error("Error leaving session:", err);
      toast({
        variant: "destructive",
        title: "Error leaving session",
        description: "Failed to leave study session"
      });
      return false;
    }
  };
  
  return {
    sessions,
    isLoading,
    error,
    getSessionById,
    createSession,
    joinSession,
    leaveSession,
    refreshSessions: fetchSessions
  };
}
