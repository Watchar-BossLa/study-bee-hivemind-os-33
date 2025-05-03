
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Type for insert data to avoid deep instantiation
interface MatchInsertData {
  status: string;
  subject_focus?: string | null;
}

/**
 * Hook for creating and joining arena matches
 */
export const useMatchCreation = () => {
  const createMatch = useCallback(async (subjectFocus?: string | null): Promise<string | null> => {
    // Create insert data explicitly typed to avoid deep instantiation
    const insertData: MatchInsertData = { status: 'waiting' };
    
    // Add subject focus if specified
    if (subjectFocus) {
      insertData.subject_focus = subjectFocus;
    }

    const { data: newMatch, error: createError } = await supabase
      .from('arena_matches')
      .insert(insertData)
      .select()
      .single();

    if (createError || !newMatch) return null;
    return newMatch.id as string;
  }, []);

  const joinMatchAsPlayer = useCallback(async (matchId: string, userId: string): Promise<boolean> => {
    const { error: joinError } = await supabase
      .from('match_players')
      .insert({ match_id: matchId, user_id: userId });

    return !joinError;
  }, []);

  const findWaitingMatch = useCallback(async (subjectFocus?: string | null): Promise<string | null> => {
    // Look for existing waiting matches with the same subject focus if specified
    let query = supabase
      .from('arena_matches')
      .select('id')
      .eq('status', 'waiting');
    
    if (subjectFocus) {
      query = query.eq('subject_focus', subjectFocus);
    }

    // Get existing matches and check if there's one we can join
    const { data: existingMatches } = await query;
    const existingMatch = existingMatches && existingMatches.length > 0 ? existingMatches[0] : null;
    
    return existingMatch ? (existingMatch.id as string) : null;
  }, []);

  return {
    createMatch,
    joinMatchAsPlayer,
    findWaitingMatch
  };
};
