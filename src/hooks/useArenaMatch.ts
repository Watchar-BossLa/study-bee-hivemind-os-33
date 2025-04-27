
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaMatch, MatchPlayer } from '@/types/arena';

export const useArenaMatch = () => {
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [matchComplete, setMatchComplete] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<() => void | null>(() => null);
  
  const { toast } = useToast();

  const joinMatch = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      let { data: existingMatch } = await supabase
        .from('arena_matches')
        .select()
        .eq('status', 'waiting')
        .single();

      let matchId: string;

      if (!existingMatch) {
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

      const { error: joinError } = await supabase
        .from('match_players')
        .insert({ match_id: matchId, user_id: user.id });

      if (joinError) throw joinError;

      const unsub = subscribeToMatch(matchId);
      setUnsubscribe(() => unsub);
      
      toast({
        title: "Joined match",
        description: "Waiting for other players...",
      });
    } catch (error) {
      toast({
        title: "Error joining match",
        description: "Failed to join match",
        variant: "destructive",
      });
    }
  };

  const subscribeToMatch = (matchId: string) => {
    const playersChannel = supabase.channel(`match_players_${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_players',
        filter: `match_id=eq.${matchId}`,
      }, () => {
        fetchMatchPlayers(matchId);
      })
      .subscribe();

    const matchChannel = supabase.channel(`arena_match_${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'arena_matches',
        filter: `id=eq.${matchId}`,
      }, () => {
        fetchMatch(matchId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(matchChannel);
    };
  };

  const fetchMatch = async (matchId: string) => {
    const { data } = await supabase
      .from('arena_matches')
      .select()
      .eq('id', matchId)
      .single();
    
    if (data) {
      const typedMatch: ArenaMatch = {
        id: data.id,
        status: data.status,
        start_time: data.start_time,
        end_time: data.end_time
      };
      
      setCurrentMatch(typedMatch);
    }
  };

  const fetchMatchPlayers = async (matchId: string) => {
    const { data } = await supabase
      .from('match_players')
      .select()
      .eq('match_id', matchId);
    
    if (data) {
      setPlayers(data);
      
      if (data.length >= 2 && currentMatch?.status === 'waiting') {
        await supabase
          .from('arena_matches')
          .update({ 
            status: 'active',
            start_time: new Date().toISOString()
          })
          .eq('id', matchId);
      }
    }
  };

  const finishMatch = async () => {
    if (!currentMatch) return;
    
    try {
      await supabase
        .from('arena_matches')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', currentMatch.id);
      
      setMatchComplete(true);
    } catch (error) {
      console.error('Error finishing match:', error);
    }
  };

  const leaveMatch = useCallback(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    
    setCurrentMatch(null);
    setPlayers([]);
    setMatchComplete(false);
  }, [unsubscribe]);

  return {
    currentMatch,
    players,
    matchComplete,
    joinMatch,
    finishMatch,
    leaveMatch
  };
};
