
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionFetch() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch all live sessions from Supabase
  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      
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
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setIsLoading(false);
      return data || [];
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions");
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error loading sessions",
        description: "Please try again later."
      });
      
      return [];
    }
  }, [toast]);
  
  return {
    isLoading,
    error,
    fetchSessions,
    setIsLoading,
    setError
  };
}
