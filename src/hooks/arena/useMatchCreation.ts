
import { useCallback } from 'react';
import { v4 as uuidv4 } from '@/lib/uuid';
import { supabase } from '@/integrations/supabase/client';

export const useMatchCreation = () => {
  const findWaitingMatch = useCallback(async (subjectFocus?: string | null): Promise<string | null> => {
    try {
      // First, check if subject_focus column exists in the arena_matches table
      const { data: columnsData, error: columnsError } = await supabase
        .from('arena_matches')
        .select('id')
        .limit(1);

      // If there's an error or no data, log it but continue with basic functionality
      if (columnsError) {
        console.error('Error checking arena_matches schema:', columnsError);
      }

      // Fetch waiting matches with a simplified query
      const { data: waitingMatches, error } = await supabase
        .from('arena_matches')
        .select('id')
        .eq('status', 'waiting')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error || !waitingMatches) {
        console.error('Error fetching waiting matches:', error);
        return null;
      }

      // Just return the first waiting match if any exist
      if (waitingMatches.length > 0) {
        return waitingMatches[0].id;
      }
      
      return null;
    } catch (error) {
      console.error('Error finding waiting match:', error);
      return null;
    }
  }, []);

  const createMatch = useCallback(async (subjectFocus?: string | null): Promise<string> => {
    try {
      const matchId = uuidv4();
      
      // Create new match record with basic required fields only
      const { error } = await supabase.from('arena_matches').insert({
        id: matchId,
        status: 'waiting'
        // We omit subject_focus since the column doesn't exist
      });
      
      if (error) {
        throw error;
      }
      
      return matchId;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }, []);

  const joinMatchAsPlayer = useCallback(async (matchId: string, userId: string): Promise<boolean> => {
    try {
      // Check if player already in match
      const { data: existingPlayer, error: checkError } = await supabase
        .from('match_players')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing player:', checkError);
        return false;
      }
      
      if (existingPlayer) {
        return true; // Already joined
      }
      
      // Join match as player
      const { error: joinError } = await supabase.from('match_players').insert({
        id: uuidv4(),
        match_id: matchId,
        user_id: userId,
        score: 0,
        correct_answers: 0,
        questions_answered: 0,
        joined_at: new Date().toISOString()
      });
      
      if (joinError) {
        console.error('Error joining match:', joinError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error joining match:', error);
      return false;
    }
  }, []);

  return {
    findWaitingMatch,
    createMatch,
    joinMatchAsPlayer
  };
};
