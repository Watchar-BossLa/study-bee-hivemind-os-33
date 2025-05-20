
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useHostDetails() {
  const fetchHostDetails = useCallback(async (hostId: string) => {
    try {
      // Fetch host details from profiles
      const { data: hostData, error: hostError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', hostId)
        .single();
      
      if (hostError) {
        console.error("Error fetching host details:", hostError);
        return null;
      }
      
      return hostData;
    } catch (err) {
      console.error("Error in fetchHostDetails:", err);
      return null;
    }
  }, []);
  
  return { fetchHostDetails };
}
