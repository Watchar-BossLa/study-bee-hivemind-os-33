
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ParticipantActivity {
  userId: string;
  userName: string;
  avatarUrl?: string;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
  messageCount: number;
  whiteBoardEdits: number;
  lastActivity?: string;
}

export interface SessionAnalytics {
  sessionId: string;
  totalParticipants: number;
  activeParticipants: number;
  totalMessages: number;
  totalWhiteboardEdits: number;
  averageSessionTime: number; // in minutes
  startTime: string;
  participantActivities: ParticipantActivity[];
}

export function useSessionAnalytics(sessionId: string) {
  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch session details
      const { data: sessionData, error: sessionError } = await supabase
        .from('live_sessions')
        .select('start_time, end_time, host_id')
        .eq('id', sessionId)
        .single();
      
      if (sessionError) throw sessionError;

      // Fetch participants data
      const { data: participantsData, error: participantsError } = await supabase
        .from('session_participants')
        .select(`
          user_id,
          role,
          joined_at,
          left_at,
          is_active,
          profiles (id, full_name, avatar_url)
        `)
        .eq('session_id', sessionId);
      
      if (participantsError) throw participantsError;

      // Count messages by participant
      const { data: messagesData, error: messagesError } = await supabase
        .from('session_messages')
        .select('user_id, user_name')
        .eq('session_id', sessionId);
      
      if (messagesError) throw messagesError;

      // Count whiteboard edits by participant
      const { data: whiteboardData, error: whiteboardError } = await supabase
        .from('session_whiteboard_paths')
        .select('user_id, user_name')
        .eq('session_id', sessionId);
      
      if (whiteboardError) throw whiteboardError;
      
      // Process participants with their activity data
      const participantActivities: ParticipantActivity[] = [];
      const messageCountMap = new Map<string, number>();
      const whiteboardEditsMap = new Map<string, number>();
      
      // Count messages per user
      messagesData?.forEach(message => {
        const userId = message.user_id;
        messageCountMap.set(userId, (messageCountMap.get(userId) || 0) + 1);
      });
      
      // Count whiteboard edits per user
      whiteboardData?.forEach(edit => {
        const userId = edit.user_id;
        whiteboardEditsMap.set(userId, (whiteboardEditsMap.get(userId) || 0) + 1);
      });
      
      // Create participant activity objects
      participantsData?.forEach(participant => {
        const profile = participant.profiles as Record<string, any> | null;
        participantActivities.push({
          userId: participant.user_id,
          userName: profile?.full_name || 'Unknown User',
          avatarUrl: profile?.avatar_url,
          joinedAt: participant.joined_at,
          leftAt: participant.left_at || undefined,
          isActive: participant.is_active,
          messageCount: messageCountMap.get(participant.user_id) || 0,
          whiteBoardEdits: whiteboardEditsMap.get(participant.user_id) || 0,
          lastActivity: getLastActivity(
            participant.joined_at, 
            messageCountMap.get(participant.user_id) || 0, 
            whiteboardEditsMap.get(participant.user_id) || 0
          )
        });
      });
      
      // Calculate session duration (in minutes)
      const startTime = new Date(sessionData.start_time);
      const endTime = sessionData.end_time ? new Date(sessionData.end_time) : new Date();
      const sessionDurationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      
      // Calculate average session time
      let totalSessionTime = 0;
      let activeCount = 0;
      
      participantsData?.forEach(participant => {
        if (participant.is_active) {
          activeCount++;
          const joinedAt = new Date(participant.joined_at);
          const participantDurationMinutes = (endTime.getTime() - joinedAt.getTime()) / (1000 * 60);
          totalSessionTime += participantDurationMinutes;
        }
      });
      
      const averageSessionTime = activeCount > 0 ? totalSessionTime / activeCount : 0;
      
      // Build the analytics object
      const sessionAnalytics: SessionAnalytics = {
        sessionId,
        totalParticipants: participantsData?.length || 0,
        activeParticipants: participantsData?.filter(p => p.is_active).length || 0,
        totalMessages: messagesData?.length || 0,
        totalWhiteboardEdits: whiteboardData?.length || 0,
        averageSessionTime: Math.round(averageSessionTime * 10) / 10, // Round to 1 decimal place
        startTime: sessionData.start_time,
        participantActivities
      };
      
      setAnalytics(sessionAnalytics);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching session analytics:", err);
      setError("Failed to load session analytics");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error loading analytics",
        description: "Failed to retrieve session statistics"
      });
    }
  }, [sessionId, toast]);

  // Helper function to determine last activity time
  const getLastActivity = (joinedAt: string, messageCount: number, whiteboardEdits: number): string | undefined => {
    // This is a simplified implementation. In a real app, you would track timestamps of all activities
    if (messageCount > 0 || whiteboardEdits > 0) {
      // For demo purposes, we'll just return "Active now" if they have messages or whiteboard edits
      return "Recently active";
    }
    
    return joinedAt;
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  
  // Set up real-time subscriptions to update analytics
  useEffect(() => {
    const channel = supabase
      .channel('session-analytics-updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'session_participants',
          filter: `session_id=eq.${sessionId}`
        }, 
        () => {
          fetchAnalytics();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'session_messages',
          filter: `session_id=eq.${sessionId}`
        }, 
        () => {
          fetchAnalytics();
        }
      )
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'session_whiteboard_paths',
          filter: `session_id=eq.${sessionId}`
        }, 
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAnalytics, sessionId]);

  return {
    analytics,
    isLoading,
    error,
    refreshAnalytics: fetchAnalytics
  };
}
