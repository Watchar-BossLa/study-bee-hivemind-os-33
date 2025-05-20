
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function usePollVoting(pollId: string | null) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const checkUserVote = useCallback(async (pollId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from('poll_responses')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      const hasVoted = !!data;
      setHasVoted(hasVoted);
      return hasVoted;
    } catch (err) {
      console.error("Error checking user vote:", err);
      return false;
    }
  }, []);

  const submitVote = async (selectedOptions: number[]) => {
    if (!pollId || selectedOptions.length === 0) {
      toast({
        variant: "destructive", 
        title: "Cannot submit vote",
        description: "No poll active or no options selected"
      });
      return false;
    }

    try {
      setIsVoting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to submit a vote"
        });
        return false;
      }

      const userId = userData.user.id;

      const { error } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: pollId,
          user_id: userId,
          selected_options: selectedOptions
        });

      if (error) throw error;

      setHasVoted(true);

      toast({
        title: "Vote submitted",
        description: "Your vote has been submitted successfully"
      });
      
      return true;
    } catch (err) {
      console.error("Error submitting vote:", err);
      toast({
        variant: "destructive",
        title: "Error submitting vote",
        description: "Failed to submit vote"
      });
      return false;
    } finally {
      setIsVoting(false);
    }
  };

  return {
    hasVoted,
    isVoting,
    checkUserVote,
    submitVote,
    resetVoteStatus: () => setHasVoted(false)
  };
}
