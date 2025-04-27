
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaMatch, MatchPlayer, QuizQuestion } from '@/types/arena';

export const useArena = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const { toast } = useToast();

  const joinMatch = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // First try to find an existing waiting match
      let { data: existingMatch } = await supabase
        .from('arena_matches')
        .select()
        .eq('status', 'waiting')
        .single();

      let matchId: string;

      if (!existingMatch) {
        // Create new match if none exists
        const { data: newMatch, error: createError } = await supabase
          .from('arena_matches')
          .insert({ status: 'waiting' })
          .select()
          .single();

        if (createError) throw createError;
        matchId = newMatch.id;
      } else {
        matchId = existingMatch.id;
      }

      // Join the match
      const { error: joinError } = await supabase
        .from('match_players')
        .insert({ match_id: matchId, user_id: user.id });

      if (joinError) throw joinError;

      // Subscribe to match updates
      subscribeToMatch(matchId);
      
      toast({
        title: "Joined match",
        description: "Waiting for other players...",
      });

    } catch (error) {
      toast({
        title: "Error joining match",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const subscribeToMatch = (matchId: string) => {
    const channel = supabase.channel('match_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_players',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        // Update players when match data changes
        fetchMatchPlayers(matchId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchMatchPlayers = async (matchId: string) => {
    const { data } = await supabase
      .from('match_players')
      .select()
      .eq('match_id', matchId);
    
    if (data) {
      setPlayers(data);
    }
  };

  return {
    isLoading,
    currentMatch,
    players,
    questions,
    joinMatch,
  };
};
