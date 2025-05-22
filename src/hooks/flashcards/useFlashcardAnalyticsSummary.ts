
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFlashcardStatistics } from './useFlashcardStatistics';
import { useFlashcardStudyTime } from './useFlashcardStudyTime';
import type { FlashcardAnalyticsSummary } from '@/types/supabase/flashcard-analytics';

/**
 * Hook to combine various flashcard analytics into a summary
 */
export const useFlashcardAnalyticsSummary = () => {
  const { data: statistics, isLoading: isLoadingStats } = useFlashcardStatistics();
  const { data: studyTimeData, isLoading: isLoadingStudyTime } = useFlashcardStudyTime('today');

  const { data: todayReviews, isLoading: isLoadingTodayReviews } = useQuery({
    queryKey: ['today-flashcard-reviews'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      // Get today's date at midnight in the user's timezone
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select('was_correct')
        .eq('user_id', user.id)
        .gte('review_time', today.toISOString())
        .order('review_time', { ascending: false });
      
      if (error) {
        console.error('Error fetching today\'s reviews:', error);
        return [];
      }
      
      return data;
    },
    enabled: !!statistics
  });
  
  // Query for cards due count
  const { data: dueCardsCount, isLoading: isLoadingDueCards } = useQuery({
    queryKey: ['flashcards-due'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return 0;
      }
      
      const { count, error } = await supabase
        .from('flashcards')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString());
      
      if (error) {
        console.error('Error fetching due cards:', error);
        return 0;
      }
      
      return count || 0;
    }
  });
  
  // Query for mastered cards count
  const { data: masteredCardsCount, isLoading: isLoadingMasteredCards } = useQuery({
    queryKey: ['flashcards-mastered'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return 0;
      }
      
      const { count, error } = await supabase
        .from('flashcards')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('consecutive_correct_answers', 5);
      
      if (error) {
        console.error('Error fetching mastered cards:', error);
        return 0;
      }
      
      return count || 0;
    }
  });
  
  // Query for total cards count
  const { data: totalCardsCount, isLoading: isLoadingTotalCards } = useQuery({
    queryKey: ['flashcards-total'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return 0;
      }
      
      const { count, error } = await supabase
        .from('flashcards')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching total cards:', error);
        return 0;
      }
      
      return count || 0;
    }
  });

  const summary: FlashcardAnalyticsSummary | undefined = statistics ? {
    total_cards: totalCardsCount || statistics.total_cards || 0,
    cards_due: dueCardsCount || statistics.cards_due || 0,
    cards_mastered: masteredCardsCount || statistics.cards_mastered || 0,
    retention_rate: statistics.retention_rate || 0,
    streak_days: statistics.streak_days || 0,
    last_study_date: statistics.last_study_date,
    reviewsToday: todayReviews?.length || 0,
    correctReviewsToday: todayReviews?.filter(review => review.was_correct).length || 0,
    studyTimeToday: studyTimeData?.totalTimeMs || 0
  } : undefined;

  return {
    summary,
    isLoading: isLoadingStats || isLoadingTodayReviews || isLoadingDueCards || 
               isLoadingMasteredCards || isLoadingTotalCards || isLoadingStudyTime
  };
};
