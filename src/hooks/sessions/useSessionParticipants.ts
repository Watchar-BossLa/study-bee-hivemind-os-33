
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSessionParticipants() {
  const fetchParticipants = useCallback(async (sessionId: string, hostId: string) => {
    try {
      const { data, error } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId)
        .eq('is_active', true);

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error("Error fetching participants:", err);
      return [];
    }
  }, []);

  return { fetchParticipants };
}
