
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
        },
        {
          id: 'first-win',
          name: 'First Win',
          description: 'Won your first quiz match',
          icon: 'trophy',
          earned: false,
        },
        {
          id: 'perfect-score',
          name: 'Perfect Score',
          description: 'Answered all questions correctly in a match',
          icon: 'star',
          earned: false,
        },
        {
          id: 'five-matches',
          name: 'Quiz Enthusiast',
          description: 'Participated in 5 quiz matches',
          icon: 'medal',
          earned: false,
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

  return {
    achievements,
    fetchAchievements,
    awardAchievement
  };
};
