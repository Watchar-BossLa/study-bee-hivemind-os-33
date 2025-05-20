
import { useState, useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { 
  formatHostData, 
  formatParticipantsData, 
  parseSessionFeatures 
} from '@/utils/sessionFormatters';

export function useSessionFetching() {
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
          const { data: participantsData, error: participantsError } = await supabase
            .from('session_participants')
            .select(`
              user_id,
              profiles (id, full_name, avatar_url)
            `)
            .eq('session_id', session.id);
          
          if (participantsError) {
            console.error("Error fetching participants:", participantsError);
          }
          
          const host = formatHostData(hostData);
          
          const participants = formatParticipantsData(participantsData || [], host.id);
          
          // Add host to participants if not already included
          if (!participants.some(p => p.id === host.id)) {
            participants.push(host);
          }
          
          // Parse features from JSON to ensure proper typing
          const typedFeatures = parseSessionFeatures(session.features);
          
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
            features: typedFeatures,
            createdAt: session.created_at,
            updatedAt: session.updated_at
          } as LiveSession;
        }));
        
        setIsLoading(false);
        return sessionsWithParticipants;
      }
      
      setIsLoading(false);
      return [];
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions");
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error loading sessions",
        description: "Please try again later."
      });
      
      return [];
    }
  }, [toast]);
  
  const getSessionById = useCallback(async (id: string) => {
    try {
      // Fetch from Supabase
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
      const { data: participantsData, error: participantsError } = await supabase
        .from('session_participants')
        .select(`
          user_id,
          profiles (id, full_name, avatar_url)
        `)
        .eq('session_id', data.id);
      
      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
      }
      
      const host = formatHostData(hostData);
      
      const participants = formatParticipantsData(participantsData || [], host.id);
      
      // Add host to participants if not already included
      if (!participants.some(p => p.id === host.id)) {
        participants.push(host);
      }
      
      // Parse features from JSON to ensure proper typing
      const typedFeatures = parseSessionFeatures(data.features);
      
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
        features: typedFeatures,
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
  }, [toast]);

  return {
    isLoading,
    error,
    fetchSessions,
    getSessionById
  };
}
