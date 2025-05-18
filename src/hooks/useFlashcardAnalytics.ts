
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FlashcardAnalyticsSummary, FlashcardStatistics } from '@/types/supabase/flashcard-analytics';

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
          flashcard_id
        `)
        .order('review_time', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      // Fetch the flashcard details for each review
      if (data && data.length > 0) {
        const flashcardIds = data.map(review => review.flashcard_id);
        
        const { data: flashcards, error: flashcardError } = await supabase
          .from('flashcards')
          .select('id, question, answer')
          .in('id', flashcardIds);
        
        if (flashcardError) throw flashcardError;
        
        // Combine review data with flashcard data
        return data.map(review => {
          const flashcard = flashcards?.find(fc => fc.id === review.flashcard_id);
          return {
            ...review,
            question: flashcard?.question || 'Question not available',
            answer: flashcard?.answer || 'Answer not available'
          };
        });
      }
      
      return data || [];
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
    total_cards: statistics.total_cards,
    cards_due: statistics.cards_due,
    cards_mastered: statistics.cards_mastered,
    retention_rate: statistics.retention_rate,
    streak_days: statistics.streak_days,
    last_study_date: statistics.last_study_date,
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
