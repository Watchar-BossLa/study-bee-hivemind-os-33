
import { useState, useEffect, useCallback } from 'react';
import { SessionPoll, PollResults } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useSessionPolls(sessionId: string) {
  const [polls, setPolls] = useState<SessionPoll[]>([]);
  const [activePoll, setActivePoll] = useState<SessionPoll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  const fetchPolls = useCallback(async () => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('session_polls')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform the data to match the SessionPoll type
        const formattedPolls = data.map(poll => {
          // Ensure options is correctly formatted as array of {text: string} objects
          let formattedOptions: { text: string }[] = [];
          
          try {
            if (Array.isArray(poll.options)) {
              // If it's already an array, make sure each item has the correct format
              formattedOptions = poll.options.map((opt: any) => {
                if (typeof opt === 'string') {
                  return { text: opt };
                } else if (typeof opt === 'object' && opt !== null && 'text' in opt) {
                  return { text: String(opt.text) };
                } else {
                  return { text: String(opt) };
                }
              });
            } else if (typeof poll.options === 'object' && poll.options !== null) {
              // Handle case where options might be an object with numeric keys
              formattedOptions = Object.values(poll.options).map((opt: any) => {
                if (typeof opt === 'string') {
                  return { text: opt };
                } else if (typeof opt === 'object' && opt !== null && 'text' in opt) {
                  return { text: String(opt.text) };
                } else {
                  return { text: String(opt) };
                }
              });
            }
          } catch (err) {
            console.error("Error formatting poll options:", err, poll.options);
            formattedOptions = [{ text: "Error loading options" }];
          }

          return {
            id: poll.id,
            sessionId: poll.session_id,
            creatorId: poll.creator_id,
            question: poll.question,
            options: formattedOptions,
            isActive: poll.is_active,
            allowMultipleChoices: poll.allow_multiple_choices,
            createdAt: poll.created_at,
            endedAt: poll.ended_at || undefined
          };
        });
        
        setPolls(formattedPolls);
        
        // Find the active poll
        const active = formattedPolls.find(p => p.isActive);
        setActivePoll(active || null);
        
        if (active) {
          await fetchPollResults(active.id);
          await checkUserVote(active.id);
        } else {
          setPollResults(null);
          setHasVoted(false);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error loading polls",
        description: "Failed to load polls for this session"
      });
    }
  }, [sessionId, toast]);

  const fetchPollResults = useCallback(async (pollId: string) => {
    try {
      const { data: responses, error: responsesError } = await supabase
        .from('poll_responses')
        .select('id, user_id, selected_options')
        .eq('poll_id', pollId);

      if (responsesError) throw responsesError;

      // Fetch total responses
      const totalResponses = responses ? responses.length : 0;

      // Initialize option counts
      const optionCounts = activePoll ? activePoll.options.map(() => 0) : [];

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
            .single();

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
            id: user.id,
            name: user.full_name || 'Unknown User',
            avatar: user.avatar_url || undefined,
            selectedOptions: response.selected_options
          };
        })
      );

      // Set the poll results
      setPollResults({
        totalResponses,
        optionCounts,
        respondents
      });
    } catch (err) {
      console.error("Error fetching poll results:", err);
      toast({
        variant: "destructive",
        title: "Error fetching poll results",
        description: "Failed to load poll results"
      });
    }
  }, [activePoll, toast]);

  const checkUserVote = useCallback(async (pollId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from('poll_responses')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      setHasVoted(!!data);
    } catch (err) {
      console.error("Error checking user vote:", err);
    }
  }, []);

  const createPoll = async (question: string, options: string[], allowMultipleChoices: boolean) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to create a poll"
        });
        return;
      }

      const creatorId = userData.user.id;

      // Format options to the correct structure
      const formattedOptions = options.map(text => ({ text }));

      const { data, error } = await supabase
        .from('session_polls')
        .insert({
          session_id: sessionId,
          creator_id: creatorId,
          question,
          options: formattedOptions,
          is_active: true,
          allow_multiple_choices: allowMultipleChoices
        })
        .select('*')
        .single();

      if (error) throw error;

      // Transform the data to match the SessionPoll type
      const newPoll: SessionPoll = {
        id: data.id,
        sessionId: data.session_id,
        creatorId: data.creator_id,
        question: data.question,
        options: Array.isArray(data.options) 
          ? data.options.map((opt: any) => ({ text: typeof opt === 'string' ? opt : opt.text })) 
          : [],
        isActive: data.is_active,
        allowMultipleChoices: data.allow_multiple_choices,
        createdAt: data.created_at,
        endedAt: data.ended_at || undefined
      };

      setPolls(prev => [newPoll, ...prev]);
      setActivePoll(newPoll);
      await fetchPollResults(newPoll.id);

      toast({
        title: "Poll created",
        description: "Your poll has been created successfully"
      });
    } catch (err) {
      console.error("Error creating poll:", err);
      toast({
        variant: "destructive",
        title: "Error creating poll",
        description: "Failed to create poll"
      });
    }
  };

  const submitVote = async (selectedOptions: number[]) => {
    if (!activePoll) {
      toast({
        variant: "destructive",
        title: "No active poll",
        description: "There is no active poll to submit a vote for"
      });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to submit a vote"
        });
        return;
      }

      const userId = userData.user.id;

      const { error } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: activePoll.id,
          user_id: userId,
          selected_options: selectedOptions
        });

      if (error) throw error;

      setHasVoted(true);
      await fetchPollResults(activePoll.id);

      toast({
        title: "Vote submitted",
        description: "Your vote has been submitted successfully"
      });
    } catch (err) {
      console.error("Error submitting vote:", err);
      toast({
        variant: "destructive",
        title: "Error submitting vote",
        description: "Failed to submit vote"
      });
    }
  };

  const endPoll = async () => {
    if (!activePoll) {
      toast({
        variant: "destructive",
        title: "No active poll",
        description: "There is no active poll to end"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('session_polls')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', activePoll.id);

      if (error) throw error;

      // Update the local state
      setPolls(prev => prev.map(poll =>
        poll.id === activePoll.id ? { ...poll, isActive: false, endedAt: new Date().toISOString() } : poll
      ));
      setActivePoll(null);
      setPollResults(null);

      toast({
        title: "Poll ended",
        description: "The poll has been ended successfully"
      });
    } catch (err) {
      console.error("Error ending poll:", err);
      toast({
        variant: "destructive",
        title: "Error ending poll",
        description: "Failed to end poll"
      });
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  return {
    polls,
    activePoll,
    pollResults,
    isLoading,
    hasVoted,
    createPoll,
    submitVote,
    endPoll,
    refreshPolls: fetchPolls
  };
}
