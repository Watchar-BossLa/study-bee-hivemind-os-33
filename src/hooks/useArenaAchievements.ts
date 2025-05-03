
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Achievement } from '@/types/arena';

export const useArenaAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { toast } = useToast();

  const fetchAchievements = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      const allAchievements: Achievement[] = [
        {
          id: 'first-match',
          name: 'First Match',
          description: 'Participated in your first quiz match',
          icon: 'award',
          earned: false,
          rarity: 'common'
        },
        {
          id: 'first-win',
          name: 'First Win',
          description: 'Won your first quiz match',
          icon: 'trophy',
          earned: false,
          rarity: 'uncommon'
        },
        {
          id: 'perfect-score',
          name: 'Perfect Score',
          description: 'Answered all questions correctly in a match',
          icon: 'star',
          earned: false,
          rarity: 'rare'
        },
        {
          id: 'five-matches',
          name: 'Quiz Enthusiast',
          description: 'Participated in 5 quiz matches',
          icon: 'medal',
          earned: false,
          rarity: 'common'
        }
      ];

      if (userAchievements) {
        userAchievements.forEach((achievement) => {
          const index = allAchievements.findIndex(a => a.id === achievement.achievement_id);
          if (index !== -1) {
            allAchievements[index].earned = true;
            allAchievements[index].earned_at = achievement.earned_at;
          }
        });
      }

      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, []);

  const awardAchievement = async (userId: string, achievementId: string) => {
    try {
      const { data } = await supabase
        .from('user_achievements')
        .select()
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);
      
      if (data && data.length > 0) return;
      
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId
        });
      
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement.name}: ${achievement.description}`,
        });
      }
      
      fetchAchievements();
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  };

  // Add the checkForAchievements function that was previously in useArena
  const checkForAchievements = useCallback(async (userId: string, matchId: string) => {
    try {
      const { data: playerData } = await supabase
        .from('match_players')
        .select('*')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .single();

      if (!playerData) return;
      
      // First match achievement
      await awardAchievement(userId, 'first-match');

      // Perfect score achievement
      if (playerData.questions_answered > 0 && playerData.correct_answers === playerData.questions_answered) {
        await awardAchievement(userId, 'perfect-score');
      }

      // Check if won the match
      const { data: allPlayers } = await supabase
        .from('match_players')
        .select('*')
        .eq('match_id', matchId);
        
      if (allPlayers) {
        const isWinner = allPlayers.every(p => p.user_id === userId || p.score < playerData.score);
        if (isWinner) {
          await awardAchievement(userId, 'first-win');
        }
      }
      
      // High score achievement
      if (playerData.score >= 100) {
        await awardAchievement(userId, 'high-score');
      }
      
      // Quick responder achievement - safely handle potentially missing property
      // Fix: Check if total_response_time exists on playerData
      const totalResponseTime = playerData.total_response_time !== undefined ? 
        playerData.total_response_time : 0;
        
      const averageResponseTime = playerData.questions_answered > 0 ? 
        totalResponseTime / playerData.questions_answered : 
        0;
        
      if (averageResponseTime <= 5 && playerData.questions_answered >= 3) {
        await awardAchievement(userId, 'quick-responder');
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }, [awardAchievement]);

  return {
    achievements,
    fetchAchievements,
    awardAchievement,
    checkForAchievements
  };
};
