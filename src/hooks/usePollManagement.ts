
import { useState, useCallback } from 'react';
import { SessionPoll } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { formatPollData } from '@/utils/pollFormatters';

export function usePollManagement(sessionId: string) {
  const [polls, setPolls] = useState<SessionPoll[]>([]);
  const [activePoll, setActivePoll] = useState<SessionPoll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPolls = useCallback(async () => {
    if (!sessionId) return [];
    
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
        const formattedPolls = data.map(poll => formatPollData(poll));
        setPolls(formattedPolls);
        
        // Find the active poll
        const active = formattedPolls.find(p => p.isActive);
        setActivePoll(active || null);
        return formattedPolls;
      }
      
      return [];
    } catch (err) {
      console.error("Error fetching polls:", err);
      toast({
        variant: "destructive",
        title: "Error loading polls",
        description: "Failed to load polls for this session"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, toast]);

  const createPoll = async (question: string, options: string[], allowMultipleChoices: boolean) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to create a poll"
        });
        return null;
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

      // Format the returned poll data
      const newPoll = formatPollData(data);
      
      // Update state
      setPolls(prev => [newPoll, ...prev]);
      setActivePoll(newPoll);

      toast({
        title: "Poll created",
        description: "Your poll has been created successfully"
      });
      
      return newPoll;
    } catch (err) {
      console.error("Error creating poll:", err);
      toast({
        variant: "destructive",
        title: "Error creating poll",
        description: "Failed to create poll"
      });
      return null;
    }
  };

  const endPoll = async () => {
    if (!activePoll) {
      toast({
        variant: "destructive",
        title: "No active poll",
        description: "There is no active poll to end"
      });
      return false;
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

      toast({
        title: "Poll ended",
        description: "The poll has been ended successfully"
      });
      
      return true;
    } catch (err) {
      console.error("Error ending poll:", err);
      toast({
        variant: "destructive",
        title: "Error ending poll",
        description: "Failed to end poll"
      });
      return false;
    }
  };

  return {
    polls,
    activePoll,
    isLoading,
    fetchPolls,
    createPoll,
    endPoll
  };
}
