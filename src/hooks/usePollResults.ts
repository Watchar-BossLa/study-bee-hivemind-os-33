
import { useState, useCallback } from 'react';
import { PollResults } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePollResults() {
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const { toast } = useToast();

  const fetchPollResults = useCallback(async (pollId: string, optionsLength: number) => {
    try {
      // Fetch responses
      const { data: responses, error: responsesError } = await supabase
        .from('poll_responses')
        .select('id, user_id, selected_options')
        .eq('poll_id', pollId);

      if (responsesError) throw responsesError;

      // Calculate totals and option counts
      const totalResponses = responses ? responses.length : 0;
      const optionCounts = Array(optionsLength).fill(0);

      // Aggregate option counts
      responses?.forEach(response => {
        if (Array.isArray(response.selected_options)) {
          response.selected_options.forEach(optionIndex => {
            if (optionIndex >= 0 && optionIndex < optionCounts.length) {
              optionCounts[optionIndex]++;
            }
          });
        }
      });

      // Fetch respondent details
      const respondents = await Promise.all(
        (responses || []).map(async (response) => {
          const { data: user, error: userError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', response.user_id)
            .maybeSingle();

          if (userError) {
            console.error("Error fetching user details:", userError);
            return {
              id: response.user_id,
              name: 'Unknown User',
              avatar: undefined,
              selectedOptions: response.selected_options
            };
          }

          return {
            id: user?.id || response.user_id,
            name: user?.full_name || 'Unknown User',
            avatar: user?.avatar_url || undefined,
            selectedOptions: response.selected_options
          };
        })
      );

      // Set results
      const results: PollResults = {
        totalResponses,
        optionCounts,
        respondents
      };
      
      setPollResults(results);
      return results;
    } catch (err) {
      console.error("Error fetching poll results:", err);
      toast({
        variant: "destructive",
        title: "Error fetching poll results",
        description: "Failed to load poll results"
      });
      return null;
    }
  }, [toast]);

  const resetPollResults = () => {
    setPollResults(null);
  };

  return {
    pollResults,
    fetchPollResults,
    resetPollResults
  };
}
