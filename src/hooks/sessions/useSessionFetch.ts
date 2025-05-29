
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setIsLoading(false);
      return data;
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError('Failed to load sessions');
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error loading sessions",
        description: "Failed to load live sessions"
      });
      
      return [];
    }
  }, [toast]);

  return {
    isLoading,
    error,
    fetchSessions,
    setIsLoading
  };
}
