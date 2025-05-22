
import { useCallback } from 'react';
import { v4 as uuidv4 } from '@/lib/uuid';
import { supabase } from '@/integrations/supabase/client';

export const useMatchCreation = () => {
  const findWaitingMatch = useCallback(async (subjectFocus?: string | null): Promise<string | null> => {
    try {
      // Check if the column exists by fetching a single record
      const { data: columnsData, error: columnsError } = await supabase
        .from('arena_matches')
        .select('id, subject_focus')
        .limit(1);

      // Just log schema issues but continue with basic functionality
      if (columnsError) {
        console.error('Error checking arena_matches schema:', columnsError);
      }

      let waitingMatches;
      let error;

      // If the column exists, filter by subject focus
      if (!columnsError) {
        if (subjectFocus) {
          // For specific subject focus
          const result = await supabase
            .from('arena_matches')
            .select('id')
            .eq('status', 'waiting')
            .eq('subject_focus', subjectFocus)
            .order('created_at', { ascending: false })
            .limit(5);
            
          waitingMatches = result.data;
          error = result.error;
        } else {
          // For null subject focus (random matches)
          const result = await supabase
            .from('arena_matches')
            .select('id')
            .eq('status', 'waiting')
            .is('subject_focus', null)
            .order('created_at', { ascending: false })
            .limit(5);
            
          waitingMatches = result.data;
          error = result.error;
        }
      } else {
        // Fallback if column doesn't exist
        const result = await supabase
          .from('arena_matches')
          .select('id')
          .eq('status', 'waiting')
          .order('created_at', { ascending: false })
          .limit(5);
          
        waitingMatches = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error('Error fetching waiting matches:', error);
        return null;
      }
      
      if (waitingMatches && waitingMatches.length > 0) {
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
      
      // Check if subject_focus column exists
      const { data: columnsData, error: columnsError } = await supabase
        .from('arena_matches')
        .select('subject_focus')
        .limit(1);
      
      // Create insert data object
      let insertData: any = {
        id: matchId,
        status: 'waiting'
      };
      
      // Only add subject_focus if the column exists and a subject is specified
      if (!columnsError && subjectFocus) {
        insertData.subject_focus = subjectFocus;
      }
      
      const { error } = await supabase.from('arena_matches').insert(insertData);
      
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
