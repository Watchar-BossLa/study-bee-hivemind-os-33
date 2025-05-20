
import { useState, useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';
import { useToast } from "@/components/ui/use-toast";
import { 
  useSessionFetch, 
  useSessionDetails, 
  useSessionParticipants, 
  useHostDetails 
} from './sessions';
import { 
  formatHostData, 
  formatParticipantsData, 
  parseSessionFeatures 
} from '@/utils/sessionFormatters';

export function useSessionFetching() {
  const { isLoading, error, fetchSessions: fetchSessionsBase, setIsLoading } = useSessionFetch();
  const { getSessionById: getSessionDataById } = useSessionDetails();
  const { fetchParticipants } = useSessionParticipants();
  const { fetchHostDetails } = useHostDetails();
  const { toast } = useToast();
  
  // Enhanced fetch sessions with additional data
  const fetchSessions = useCallback(async () => {
    const sessionsData = await fetchSessionsBase();
    
    // For each session, fetch the host details and participants
    if (sessionsData) {
      const sessionsWithParticipants = await Promise.all(sessionsData.map(async (session) => {
        // Fetch host details
        const hostData = await fetchHostDetails(session.host_id);
        
        // Fetch participants
        const participantsData = await fetchParticipants(session.id, session.host_id);
        
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
      
      return sessionsWithParticipants;
    }
    
    return [];
  }, [fetchSessionsBase, fetchHostDetails, fetchParticipants]);
  
  // Enhanced get session by ID with additional data
  const getSessionById = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      
      // Fetch base session data
      const sessionData = await getSessionDataById(id);
      
      if (!sessionData) return null;
      
      // Fetch host details
      const hostData = await fetchHostDetails(sessionData.host_id);
      
      // Fetch participants
      const participantsData = await fetchParticipants(sessionData.id, sessionData.host_id);
      
      const host = formatHostData(hostData);
      
      const participants = formatParticipantsData(participantsData || [], host.id);
      
      // Add host to participants if not already included
      if (!participants.some(p => p.id === host.id)) {
        participants.push(host);
      }
      
      // Parse features from JSON to ensure proper typing
      const typedFeatures = parseSessionFeatures(sessionData.features);
      
      const session: LiveSession = {
        id: sessionData.id,
        title: sessionData.title,
        description: sessionData.description || undefined,
        subject: sessionData.subject,
        host,
        participants,
        maxParticipants: sessionData.max_participants,
        startTime: sessionData.start_time,
        endTime: sessionData.end_time || undefined,
        status: sessionData.status as 'scheduled' | 'active' | 'ended',
        isPrivate: sessionData.is_private,
        accessCode: sessionData.access_code || undefined,
        features: typedFeatures,
        createdAt: sessionData.created_at,
        updatedAt: sessionData.updated_at
      };
      
      setIsLoading(false);
      return session;
    } catch (err) {
      console.error("Error fetching session by ID:", err);
      toast({
        variant: "destructive",
        title: "Error loading session",
        description: "Could not load the requested session."
      });
      setIsLoading(false);
      return null;
    }
  }, [getSessionDataById, fetchHostDetails, fetchParticipants, setIsLoading, toast]);

  return {
    isLoading,
    error,
    fetchSessions,
    getSessionById
  };
}
