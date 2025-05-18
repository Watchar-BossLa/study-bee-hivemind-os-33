
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArenaMatch } from '@/types/arena';

interface MatchCompletionEffectProps {
  currentMatch: ArenaMatch | null;
  matchComplete: boolean;
  checkForAchievements: (userId: string, matchId: string) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  resetQuestions: () => void;
}

export const useMatchCompletionEffect = ({
  currentMatch,
  matchComplete,
  checkForAchievements,
  fetchUserStats,
  fetchLeaderboard,
  resetQuestions
}: MatchCompletionEffectProps) => {
  // Effect to handle match completion
  useEffect(() => {
    if (matchComplete && currentMatch) {
      const fetchUserAndCheckAchievements = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await checkForAchievements(user.id, currentMatch.id);
        }
        
        await fetchUserStats();
        await fetchLeaderboard();
        resetQuestions();
      };
      
      fetchUserAndCheckAchievements();
    }
  }, [
    matchComplete, 
    currentMatch, 
    checkForAchievements, 
    fetchUserStats, 
    fetchLeaderboard,
    resetQuestions
  ]);
};
