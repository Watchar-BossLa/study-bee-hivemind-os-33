
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LiveSession, SessionPoll, PollResults } from '@/types/livesessions';
import CreatePollButton from './polls/CreatePollButton';
import ActivePoll from './polls/ActivePoll';
import NoPollsMessage from './polls/NoPollsMessage';
import PollHistory from './polls/PollHistory';
import CreatePollForm from './CreatePollForm';

interface SessionPollProps {
  session: LiveSession;
}

const SessionPollComponent: React.FC<SessionPollProps> = ({ session }) => {
  const [polls, setPolls] = useState<SessionPoll[]>([]);
  const [activePoll, setActivePoll] = useState<SessionPoll | null>(null);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  // Check if current user is the host
  const isHost = session.host.id === 'current-user-id'; // In real app, get from auth

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('session_polls')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPolls: SessionPoll[] = (data || []).map(poll => ({
        id: poll.id,
        sessionId: poll.session_id,
        creatorId: poll.creator_id,
        question: poll.question,
        options: poll.options as any,
        allowMultipleChoices: poll.allow_multiple_choices,
        isActive: poll.is_active,
        createdAt: poll.created_at,
        endedAt: poll.ended_at || undefined
      }));

      setPolls(transformedPolls);
      const active = transformedPolls.find(p => p.isActive);
      setActivePoll(active || null);

      if (active) {
        await checkVoteStatus(active.id);
        await fetchPollResults(active.id);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: 'Error',
        description: 'Failed to load polls',
        variant: 'destructive'
      });
    }
  };

  const checkVoteStatus = async (pollId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('poll_responses')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .single();

      setHasVoted(!!data);
    } catch (error) {
      // No vote found, which is fine
      setHasVoted(false);
    }
  };

  const fetchPollResults = async (pollId: string) => {
    try {
      const { data: responses, error } = await supabase
        .from('poll_responses')
        .select('selected_options')
        .eq('poll_id', pollId);

      if (error) throw error;

      const poll = polls.find(p => p.id === pollId);
      if (!poll) return;

      // Calculate results
      const optionCounts = new Array(poll.options.length).fill(0);
      let totalResponses = 0;

      responses?.forEach(response => {
        const selectedOptions = response.selected_options as number[];
        selectedOptions.forEach(optionIndex => {
          if (optionIndex >= 0 && optionIndex < optionCounts.length) {
            optionCounts[optionIndex]++;
          }
        });
        totalResponses++;
      });

      const results: PollResults = {
        totalResponses,
        optionCounts,
        respondents: responses?.map(r => ({
          id: 'voter-id',
          name: 'Voter',
          selectedOptions: r.selected_options as number[]
        })) || []
      };

      setPollResults(results);
    } catch (error) {
      console.error('Error fetching poll results:', error);
    }
  };

  useEffect(() => {
    fetchPolls();

    // Set up real-time subscription for polls
    const channel = supabase
      .channel(`session_polls_${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_polls',
          filter: `session_id=eq.${session.id}`
        },
        () => {
          fetchPolls();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'poll_responses'
        },
        (payload) => {
          const response = payload.new as any;
          if (activePoll && response.poll_id === activePoll.id) {
            fetchPollResults(activePoll.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id, activePoll?.id]);

  const handleCreatePoll = () => {
    setShowCreateForm(true);
  };

  const handleSubmitVote = async (selectedOptions: number[]) => {
    if (!activePoll || hasVoted) return;

    setIsVoting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to vote',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: activePoll.id,
          user_id: user.id,
          selected_options: selectedOptions
        });

      if (error) throw error;

      setHasVoted(true);
      toast({
        title: 'Vote submitted',
        description: 'Your vote has been recorded',
      });

      await fetchPollResults(activePoll.id);
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit vote',
        variant: 'destructive'
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleEndPoll = async () => {
    if (!activePoll || !isHost) return;

    try {
      const { error } = await supabase
        .from('session_polls')
        .update({ 
          is_active: false, 
          ended_at: new Date().toISOString() 
        })
        .eq('id', activePoll.id);

      if (error) throw error;

      toast({
        title: 'Poll ended',
        description: 'The poll has been closed',
      });

      await fetchPolls();
    } catch (error) {
      console.error('Error ending poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to end poll',
        variant: 'destructive'
      });
    }
  };

  if (showCreateForm) {
    return (
      <CreatePollForm
        session={session}
        onClose={() => setShowCreateForm(false)}
        onPollCreated={() => {
          setShowCreateForm(false);
          fetchPolls();
        }}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Live Polls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activePoll ? (
          <ActivePoll
            poll={activePoll}
            isHost={isHost}
            hasVoted={hasVoted}
            isVoting={isVoting}
            pollResults={pollResults}
            onEndPoll={handleEndPoll}
            onSubmitVote={handleSubmitVote}
          />
        ) : (
          <>
            {isHost && <CreatePollButton onClick={handleCreatePoll} />}
            <NoPollsMessage isHost={isHost} onCreatePoll={handleCreatePoll} />
          </>
        )}
        
        <PollHistory polls={polls} />
      </CardContent>
    </Card>
  );
};

export default SessionPollComponent;
