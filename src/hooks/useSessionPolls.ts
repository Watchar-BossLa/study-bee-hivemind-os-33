
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SessionPoll, PollResponse, PollResults } from '@/types/livesessions';

export function useSessionPolls(sessionId: string) {
  const [polls, setPolls] = useState<SessionPoll[]>([]);
  const [activePoll, setActivePoll] = useState<SessionPoll | null>(null);
  const [pollResponses, setPollResponses] = useState<Record<string, PollResponse[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch polls for the current session
  const fetchPolls = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: pollsError } = await supabase
        .from('session_polls')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
      
      if (pollsError) throw pollsError;

      if (data) {
        const formattedPolls: SessionPoll[] = data.map(poll => ({
          id: poll.id,
          sessionId: poll.session_id,
          creatorId: poll.creator_id,
          question: poll.question,
          options: Array.isArray(poll.options) ? poll.options : [],
          isActive: poll.is_active,
          allowMultipleChoices: poll.allow_multiple_choices || false,
          createdAt: poll.created_at,
          endedAt: poll.ended_at
        }));
        
        setPolls(formattedPolls);
        
        // Set the active poll if there is one
        const active = formattedPolls.find(p => p.isActive);
        setActivePoll(active || null);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching polls:', err);
      setError('Failed to load polls');
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error loading polls",
        description: "Please try again later"
      });
    }
  }, [sessionId, toast]);

  // Fetch responses for a specific poll
  const fetchPollResponses = useCallback(async (pollId: string) => {
    try {
      const { data, error: responsesError } = await supabase
        .from('poll_responses')
        .select(`
          id,
          poll_id,
          user_id,
          selected_options,
          created_at,
          profiles:user_id (id, full_name, avatar_url)
        `)
        .eq('poll_id', pollId);
      
      if (responsesError) throw responsesError;

      if (data) {
        const responses: PollResponse[] = data.map(item => ({
          id: item.id,
          pollId: item.poll_id,
          userId: item.user_id,
          selectedOptions: item.selected_options,
          createdAt: item.created_at
        }));
        
        setPollResponses(prev => ({
          ...prev,
          [pollId]: responses
        }));
      }
    } catch (err) {
      console.error('Error fetching poll responses:', err);
      toast({
        variant: "destructive",
        title: "Error loading poll responses",
        description: "Please try again later"
      });
    }
  }, [toast]);

  // Create a new poll
  const createPoll = useCallback(async (pollData: Omit<SessionPoll, 'id' | 'sessionId' | 'creatorId' | 'createdAt' | 'endedAt'>) => {
    try {
      setIsSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to create a poll"
        });
        setIsSubmitting(false);
        return null;
      }
      
      const { data, error } = await supabase
        .from('session_polls')
        .insert({
          session_id: sessionId,
          creator_id: userData.user.id,
          question: pollData.question,
          options: pollData.options,
          is_active: pollData.isActive,
          allow_multiple_choices: pollData.allowMultipleChoices
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Poll created",
        description: "Your poll has been created successfully"
      });
      
      await fetchPolls();
      setIsSubmitting(false);
      return data.id;
    } catch (err) {
      console.error('Error creating poll:', err);
      toast({
        variant: "destructive",
        title: "Error creating poll",
        description: "Please try again later"
      });
      setIsSubmitting(false);
      return null;
    }
  }, [sessionId, fetchPolls, toast]);

  // End an active poll
  const endPoll = useCallback(async (pollId: string) => {
    try {
      const { error } = await supabase
        .from('session_polls')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', pollId);
      
      if (error) throw error;
      
      toast({
        title: "Poll ended",
        description: "The poll has been ended successfully"
      });
      
      await fetchPolls();
      return true;
    } catch (err) {
      console.error('Error ending poll:', err);
      toast({
        variant: "destructive",
        title: "Error ending poll",
        description: "Please try again later"
      });
      return false;
    }
  }, [fetchPolls, toast]);

  // Submit a response to a poll
  const submitPollResponse = useCallback(async (pollId: string, selectedOptions: number[]) => {
    try {
      setIsSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to respond to a poll"
        });
        setIsSubmitting(false);
        return false;
      }
      
      // Check if user has already responded
      const { data: existingResponse } = await supabase
        .from('poll_responses')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userData.user.id)
        .maybeSingle();
      
      if (existingResponse) {
        toast({
          variant: "destructive",
          title: "Already responded",
          description: "You have already submitted a response to this poll"
        });
        setIsSubmitting(false);
        return false;
      }
      
      const { error } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: pollId,
          user_id: userData.user.id,
          selected_options: selectedOptions
        });
      
      if (error) throw error;
      
      toast({
        title: "Response submitted",
        description: "Your response has been recorded"
      });
      
      await fetchPollResponses(pollId);
      setIsSubmitting(false);
      return true;
    } catch (err) {
      console.error('Error submitting poll response:', err);
      toast({
        variant: "destructive",
        title: "Error submitting response",
        description: "Please try again later"
      });
      setIsSubmitting(false);
      return false;
    }
  }, [fetchPollResponses, toast]);

  // Calculate poll results
  const calculatePollResults = useCallback((pollId: string): PollResults | null => {
    const poll = polls.find(p => p.id === pollId);
    const responses = pollResponses[pollId] || [];
    
    if (!poll) return null;
    
    // Count responses for each option
    const optionCounts = Array(poll.options.length).fill(0);
    
    // Track respondents
    const respondents: {
      id: string;
      name: string;
      avatar?: string;
      selectedOptions: number[];
    }[] = [];
    
    // Process responses
    responses.forEach(response => {
      // Increment option counts
      response.selectedOptions.forEach(optionIndex => {
        if (optionIndex >= 0 && optionIndex < optionCounts.length) {
          optionCounts[optionIndex]++;
        }
      });
      
      // Add respondent info
      respondents.push({
        id: response.userId,
        name: 'Participant', // In a real app, you'd fetch from profiles
        selectedOptions: response.selectedOptions
      });
    });
    
    return {
      totalResponses: responses.length,
      optionCounts,
      respondents
    };
  }, [polls, pollResponses]);

  // Initial data fetch
  useEffect(() => {
    if (sessionId) {
      fetchPolls();
    }
  }, [sessionId, fetchPolls]);

  // Set up real-time subscriptions for polls
  useEffect(() => {
    const channel = supabase
      .channel('session-polls')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'session_polls',
          filter: `session_id=eq.${sessionId}`
        }, 
        () => {
          fetchPolls();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchPolls]);

  // Set up real-time subscriptions for poll responses
  useEffect(() => {
    const channel = supabase
      .channel('poll-responses')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'poll_responses'
        }, 
        (payload) => {
          const pollId = payload.new.poll_id;
          if (pollId) {
            fetchPollResponses(pollId);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPollResponses]);

  // Fetch responses for all polls
  useEffect(() => {
    if (polls.length > 0) {
      polls.forEach(poll => {
        fetchPollResponses(poll.id);
      });
    }
  }, [polls, fetchPollResponses]);

  return {
    polls,
    activePoll,
    pollResponses,
    isLoading,
    isSubmitting,
    error,
    createPoll,
    endPoll,
    submitPollResponse,
    calculatePollResults,
    refreshPolls: fetchPolls
  };
}
