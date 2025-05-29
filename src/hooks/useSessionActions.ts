
import { useState, useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { sessionFeaturesToJson } from '@/utils/sessionFormatters';

export function useSessionActions() {
  const { toast } = useToast();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  // Create a new session
  const createSession = useCallback(async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    try {
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to create a session."
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          host_id: user.data.user.id,
          title: sessionData.title,
          description: sessionData.description,
          subject: sessionData.subject,
          max_participants: sessionData.maxParticipants,
          is_private: sessionData.isPrivate,
          access_code: sessionData.accessCode,
          features: sessionFeaturesToJson(sessionData.features),
          status: sessionData.status
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      // Set as active session
      setActiveSessionId(data.id);
      
      toast({
        title: "Session Created",
        description: "Your study session has been created successfully."
      });
      
      return data.id;
    } catch (err) {
      console.error("Error creating session:", err);
      toast({
        variant: "destructive",
        title: "Failed to Create Session",
        description: "There was an error creating your session."
      });
      return null;
    }
  }, [toast]);
  
  // Join a session
  const joinSession = useCallback(async (sessionId: string, accessCode?: string) => {
    try {
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to join a session."
        });
        return false;
      }
      
      // Check if session exists and if it requires an access code
      const { data: sessionData, error: sessionError } = await supabase
        .from('live_sessions')
        .select('is_private, access_code')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;
      
      // Validate access code if the session is private
      if (sessionData.is_private && sessionData.access_code !== accessCode) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Invalid access code for this private session."
        });
        return false;
      }
      
      // Check if user is already a participant
      const { data: existingParticipant, error: participantError } = await supabase
        .from('session_participants')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', user.data.user.id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (participantError) throw participantError;
      
      // If user is already an active participant, just set as active
      if (existingParticipant) {
        setActiveSessionId(sessionId);
        return true;
      }
      
      // Add user as a participant
      const { error: insertError } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: user.data.user.id,
          is_active: true
        });
      
      if (insertError) throw insertError;
      
      // Set as active session
      setActiveSessionId(sessionId);
      
      toast({
        title: "Session Joined",
        description: "You have joined the study session."
      });
      
      return true;
    } catch (err) {
      console.error("Error joining session:", err);
      toast({
        variant: "destructive",
        title: "Failed to Join Session",
        description: "There was an error joining the session."
      });
      return false;
    }
  }, [toast]);
  
  // Leave a session
  const leaveSession = useCallback(async () => {
    try {
      if (!activeSessionId) {
        return;
      }
      
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        return;
      }
      
      // Update participant record to set as inactive
      const { error } = await supabase
        .from('session_participants')
        .update({ 
          is_active: false,
          left_at: new Date().toISOString()
        })
        .eq('session_id', activeSessionId)
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      
      // Clear active session
      setActiveSessionId(null);
      
    } catch (err) {
      console.error("Error leaving session:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave the session properly."
      });
    }
  }, [activeSessionId, toast]);
  
  return {
    createSession,
    joinSession,
    leaveSession,
    activeSessionId
  };
}
