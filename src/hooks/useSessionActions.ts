
import { useCallback } from 'react';
import { LiveSession } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionActions() {
  const { toast } = useToast();
  
  const createSession = async (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => {
    try {
      const user = await supabase.auth.getSession();
      if (!user.data.session) {
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
      
      // Prepare features object for proper storage
      const features = {
        video: sessionData.features.video,
        audio: sessionData.features.audio,
        chat: sessionData.features.chat,
        whiteboard: sessionData.features.whiteboard,
        screenSharing: sessionData.features.screenSharing,
        polls: true // Enable polls by default
      };
      
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
          features: features,
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
      
      return data.id;
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
      
      return sessionId;
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
    createSession,
    joinSession,
    leaveSession
  };
}
