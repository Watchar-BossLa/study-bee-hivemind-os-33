
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to get flashcard activity data for heatmap visualization
 */
export const useFlashcardActivityHeatmap = (days = 90) => {
  return useQuery({
    queryKey: ['flashcard-activity-heatmap', days],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select('review_time, was_correct')
        .eq('user_id', user.id)
        .gte('review_time', startDate.toISOString())
        .lte('review_time', endDate.toISOString());
      
      if (error) {
        console.error('Error fetching activity data:', error);
        return [];
      }
      
      // Process data for heatmap format
      const heatmapData = data.reduce((acc, review) => {
        const date = review.review_time.split('T')[0]; // Extract YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = { count: 0, correct: 0 };
        }
        acc[date].count++;
        if (review.was_correct) {
          acc[date].correct++;
        }
        return acc;
      }, {} as Record<string, { count: number; correct: number }>);
      
      return Object.entries(heatmapData).map(([date, stats]) => ({
        date,
        count: stats.count,
        correct: stats.correct,
        accuracy: stats.count > 0 ? (stats.correct / stats.count * 100) : 0
      }));
    }
  });
};
