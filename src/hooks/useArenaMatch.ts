
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaMatch, MatchPlayer } from '@/types/arena';

// Define simpler types to avoid excessive type instantiation
interface DbArenaMatchSimple {
  id: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  subject_focus?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface DbMatchPlayerSimple {
  id: string;
  match_id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  questions_answered: number;
  total_response_time?: number;
  streak?: number;
  created_at: string | null;
}

export const useArenaMatch = () => {
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [matchComplete, setMatchComplete] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(() => null);
  
  const { toast } = useToast();

  const joinMatch = async (subjectFocus?: string | null) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // Look for existing waiting matches with the same subject focus if specified
      let query = supabase
        .from('arena_matches')
        .select()
        .eq('status', 'waiting');
      
      if (subjectFocus) {
        query = query.eq('subject_focus', subjectFocus);
      }

      const { data: existingMatches } = await query;
      let existingMatch = existingMatches && existingMatches.length > 0 ? existingMatches[0] : null;

      let matchId: string;

      if (!existingMatch) {
        const insertData: Record<string, unknown> = { status: 'waiting' };
        
        // Add subject focus if specified
        if (subjectFocus) {
          insertData.subject_focus = subjectFocus;
        }

        const { data: newMatch, error: createError } = await supabase
          .from('arena_matches')
          .insert(insertData)
          .select()
          .single();

        if (createError) throw createError;
        if (!newMatch) throw new Error('Failed to create match');
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
      
      const subjectMessage = subjectFocus ? 
        `Joined ${subjectFocus} match` : 
        "Joined match";
      
      toast({
        title: subjectMessage,
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
      const dbMatch = data as unknown as DbArenaMatchSimple;
      
      const typedMatch: ArenaMatch = {
        id: dbMatch.id,
        status: dbMatch.status as 'waiting' | 'active' | 'completed',
        start_time: dbMatch.start_time,
        end_time: dbMatch.end_time,
        subject_focus: dbMatch.subject_focus,
        created_at: dbMatch.created_at,
        updated_at: dbMatch.updated_at
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
      // Convert database response to MatchPlayer type
      const typedPlayers: MatchPlayer[] = data.map((player: unknown) => {
        const typedPlayer = player as DbMatchPlayerSimple;
        return {
          id: typedPlayer.id,
          match_id: typedPlayer.match_id,
          user_id: typedPlayer.user_id,
          score: typedPlayer.score || 0,
          correct_answers: typedPlayer.correct_answers || 0,
          questions_answered: typedPlayer.questions_answered || 0,
          total_response_time: typedPlayer.total_response_time || 0,
          streak: typedPlayer.streak || 0,
          joined_at: typedPlayer.created_at || new Date().toISOString()
        };
      });
      
      setPlayers(typedPlayers);
      
      if (typedPlayers.length >= 2 && currentMatch?.status === 'waiting') {
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
          status: 'completed' as const,
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
