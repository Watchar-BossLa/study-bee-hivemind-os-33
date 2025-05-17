
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FlashcardAnalyticsSummary, FlashcardStatistics } from '@/types/supabase-extensions';

export const useFlashcardStatistics = () => {
  return useQuery({
    queryKey: ['flashcard-statistics'],
    queryFn: async (): Promise<FlashcardStatistics | null> => {
      const { data, error } = await supabase
        .from('flashcard_statistics')
        .select('*')
        .single();
      
      if (error) {
        // If no statistics exist yet, this isn't necessarily an error
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      return data;
    }
  });
};

export const useRecentFlashcardReviews = (limit = 10) => {
  return useQuery({
    queryKey: ['recent-flashcard-reviews', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select(`
          id, 
          was_correct, 
          review_time, 
          confidence_level,
          flashcards (
            id, 
            question, 
            answer
          )
        `)
        .order('review_time', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useFlashcardAnalyticsSummary = () => {
  const { data: statistics, isLoading: isLoadingStats } = useFlashcardStatistics();

  const { data: todayReviews, isLoading: isLoadingTodayReviews } = useQuery({
    queryKey: ['today-flashcard-reviews'],
    queryFn: async () => {
      // Get today's date at midnight in the user's timezone
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select('*')
        .gte('review_time', today.toISOString())
        .order('review_time', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const summary: FlashcardAnalyticsSummary | undefined = statistics ? {
    totalCards: statistics.total_cards,
    cardsDue: statistics.cards_due,
    cardsLearned: statistics.cards_learned, 
    cardsMastered: statistics.cards_mastered,
    retentionRate: statistics.retention_rate,
    streak: statistics.streak_days,
    studyTimeToday: 0, // Will be populated if we add study time tracking
    reviewsToday: todayReviews?.length || 0,
    correctReviewsToday: todayReviews?.filter(review => review.was_correct).length || 0
  } : undefined;

  return {
    summary,
    isLoading: isLoadingStats || isLoadingTodayReviews
  };
};

export const useFlashcardActivityHeatmap = (days = 90) => {
  return useQuery({
    queryKey: ['flashcard-activity-heatmap', days],
    queryFn: async () => {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select('review_time, was_correct')
        .gte('review_time', startDate.toISOString())
        .lte('review_time', endDate.toISOString());
      
      if (error) throw error;
      
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
