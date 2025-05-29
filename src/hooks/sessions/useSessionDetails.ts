
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSessionDetails() {
  const getSessionById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error("Error fetching session details:", err);
      return null;
    }
  }, []);

  return { getSessionById };
}
