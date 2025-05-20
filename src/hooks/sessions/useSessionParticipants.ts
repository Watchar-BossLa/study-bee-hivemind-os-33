
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSessionParticipants() {
  const fetchParticipants = useCallback(async (sessionId: string, hostId: string) => {
    try {
      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('session_participants')
        .select(`
          user_id,
          profiles (id, full_name, avatar_url)
        `)
        .eq('session_id', sessionId);
      
      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        return [];
      }
      
      return participantsData || [];
    } catch (err) {
      console.error("Error in fetchParticipants:", err);
      return [];
    }
  }, []);
  
  return { fetchParticipants };
}
