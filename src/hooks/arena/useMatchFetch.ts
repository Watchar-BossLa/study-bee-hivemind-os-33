
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaMatch, MatchPlayer } from '@/types/arena';

// Define simpler types for database responses to avoid excessive type instantiation
interface DbArenaMatchResponse {
  id: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  subject_focus?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface DbMatchPlayerResponse {
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

/**
 * Hook for fetching match and player data from Supabase
 */
export const useMatchFetch = () => {
  const fetchMatch = async (matchId: string): Promise<ArenaMatch | null> => {
    const { data } = await supabase
      .from('arena_matches')
      .select()
      .eq('id', matchId)
      .single();
    
    if (data) {
      const dbMatch = data as DbArenaMatchResponse;
      
      const typedMatch: ArenaMatch = {
        id: dbMatch.id,
        status: dbMatch.status as 'waiting' | 'active' | 'completed',
        start_time: dbMatch.start_time,
        end_time: dbMatch.end_time,
        subject_focus: dbMatch.subject_focus,
        created_at: dbMatch.created_at,
        updated_at: dbMatch.updated_at
      };
      
      return typedMatch;
    }
    return null;
  };

  const fetchMatchPlayers = async (matchId: string): Promise<MatchPlayer[]> => {
    const { data } = await supabase
      .from('match_players')
      .select()
      .eq('match_id', matchId);
    
    if (data) {
      // Convert database response to MatchPlayer type
      const typedPlayers: MatchPlayer[] = data.map((player) => {
        const typedPlayer = player as DbMatchPlayerResponse;
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
      
      return typedPlayers;
    }
    return [];
  };

  return {
    fetchMatch,
    fetchMatchPlayers
  };
};
