
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionDetails() {
  const { toast } = useToast();
  
  // Fetch a specific session by ID
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
      
      return data;
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
    getSessionById
  };
}
