
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaStats, LeaderboardEntry } from '@/types/arena';

export const useArenaStats = () => {
  const [arenaStats, setArenaStats] = useState<ArenaStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const fetchUserStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: stats } = await supabase
        .from('arena_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (stats) {
        setArenaStats(stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('arena_stats')
        .select('*')
        .order('highest_score', { ascending: false })
        .limit(10);

      if (data) {
        const formattedLeaderboard: LeaderboardEntry[] = data.map((entry) => ({
          user_id: entry.user_id,
          username: entry.user_id.substring(0, 8),
          matches_played: entry.matches_played,
          matches_won: entry.matches_won,
          total_score: entry.total_score,
          highest_score: entry.highest_score,
          win_rate: entry.matches_played > 0 ? (entry.matches_won / entry.matches_played) : 0
        }));
        
        setLeaderboard(formattedLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }, []);

  return {
    arenaStats,
    leaderboard,
    fetchUserStats,
    fetchLeaderboard
  };
};
