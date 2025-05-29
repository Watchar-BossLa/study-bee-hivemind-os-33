
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useHostDetails() {
  const fetchHostDetails = useCallback(async (hostId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', hostId)
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      console.error("Error fetching host details:", err);
      return { id: hostId, full_name: 'Unknown Host', avatar_url: null };
    }
  }, []);

  return { fetchHostDetails };
}
