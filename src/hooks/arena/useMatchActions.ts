
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for performing actions on arena matches
 */
export const useMatchActions = () => {
  const activateMatch = useCallback(async (matchId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('arena_matches')
      .update({ 
        status: 'active',
        start_time: new Date().toISOString()
      })
      .eq('id', matchId);
    
    return !error;
  }, []);

  const finishMatch = useCallback(async (matchId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('arena_matches')
      .update({ 
        status: 'completed',
        end_time: new Date().toISOString()
      })
      .eq('id', matchId);
    
    return !error;
  }, []);

  return {
    activateMatch,
    finishMatch
  };
};
