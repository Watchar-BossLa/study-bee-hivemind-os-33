import { useCallback } from 'react';
import { v4 as uuidv4 } from '@/lib/uuid';
import { supabase } from '@/integrations/supabase/client';

export const useMatchCreation = () => {
  const findWaitingMatch = useCallback(async (subjectFocus?: string | null): Promise<string | null> => {
    try {
      const { data: waitingMatches } = await supabase
        .from('arena_matches')
        .select('id, subject_focus')
        .eq('status', 'waiting')
        .order('created_at', { ascending: false })
        .limit(5);

      // Only consider subject-specific matches when a subject is selected
      // Otherwise only consider general/random topic matches
      if (waitingMatches && waitingMatches.length > 0) {
        const matchedMatch = waitingMatches.find(match => {
          if (subjectFocus) {
            return match.subject_focus === subjectFocus;
          } else {
            return !match.subject_focus;
          }
        });
        
        if (matchedMatch) {
          return matchedMatch.id;
        }
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
      
      // Create new match record
      await supabase.from('arena_matches').insert({
        id: matchId,
        status: 'waiting',
        subject_focus: subjectFocus || null
      });
      
      return matchId;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }, []);

  const joinMatchAsPlayer = useCallback(async (matchId: string, userId: string): Promise<boolean> => {
    try {
      // Check if player already in match
      const { data: existingPlayer } = await supabase
        .from('match_players')
        .select('id')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existingPlayer) {
        return true; // Already joined
      }
      
      // Join match as player
      await supabase.from('match_players').insert({
        id: uuidv4(),
        match_id: matchId,
        user_id: userId,
        score: 0,
        correct_answers: 0,
        questions_answered: 0,
        joined_at: new Date().toISOString()
      });
      
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
