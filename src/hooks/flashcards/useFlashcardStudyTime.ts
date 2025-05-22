
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch user's study time for flashcards
 * @param timeframe - The timeframe to fetch study time for (today, week, month, all)
 */
export const useFlashcardStudyTime = (timeframe: 'today' | 'week' | 'month' | 'all' = 'today') => {
  return useQuery({
    queryKey: ['flashcard-study-time', timeframe],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { totalTimeMs: 0, sessions: 0, averageTimePerCardMs: 0 };
      }
      
      // Calculate date range based on timeframe
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'today':
          startDate.setHours(0, 0, 0, 0); // Start of today
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7); // 7 days ago
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1); // 1 month ago
          break;
        case 'all':
          startDate.setFullYear(2000); // Far in the past to get all data
          break;
      }
      
      // Get all flashcard reviews in the timeframe with response time
      const { data: reviews, error } = await supabase
        .from('flashcard_reviews')
        .select('response_time_ms, flashcard_id')
        .eq('user_id', user.id)
        .gte('review_time', startDate.toISOString())
        .lte('review_time', endDate.toISOString())
        .not('response_time_ms', 'is', null);
      
      if (error) {
        console.error('Error fetching study time:', error);
        return { totalTimeMs: 0, sessions: 0, averageTimePerCardMs: 0 };
      }
      
      // Calculate total time spent
      const totalTimeMs = reviews?.reduce((sum, review) => sum + (review.response_time_ms || 0), 0) || 0;
      
      // Count unique sessions (approximation: each batch of reviews within 10 minutes counts as one session)
      const uniqueFlashcards = new Set(reviews?.map(review => review.flashcard_id) || []);
      
      return {
        totalTimeMs,
        sessions: reviews?.length || 0,
        uniqueCards: uniqueFlashcards.size,
        averageTimePerCardMs: uniqueFlashcards.size > 0 ? totalTimeMs / uniqueFlashcards.size : 0
      };
    }
  });
};
