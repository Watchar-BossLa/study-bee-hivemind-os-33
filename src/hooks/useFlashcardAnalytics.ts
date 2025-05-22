
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FlashcardAnalyticsSummary, FlashcardStatistics } from '@/types/supabase/flashcard-analytics';

export const useFlashcardStatistics = () => {
  return useQuery({
    queryKey: ['flashcard-statistics'],
    queryFn: async (): Promise<FlashcardStatistics | null> => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('flashcard_statistics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching statistics:', error);
        return null;
      }
      
      return data;
    }
  });
};

export const useRecentFlashcardReviews = (limit = 10) => {
  return useQuery({
    queryKey: ['recent-flashcard-reviews', limit],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select(`
          id, 
          was_correct, 
          review_time, 
          confidence_level,
          flashcard_id
        `)
        .eq('user_id', user.id)
        .order('review_time', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
      
      // Fetch the flashcard details for each review
      if (data && data.length > 0) {
        const flashcardIds = data.map(review => review.flashcard_id);
        
        const { data: flashcards, error: flashcardError } = await supabase
          .from('flashcards')
          .select('id, question, answer')
          .in('id', flashcardIds);
        
        if (flashcardError) {
          console.error('Error fetching flashcard details:', flashcardError);
          return data;
        }
        
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
    correctReviewsToday: todayReviews?.filter(review => review.was_correct).length || 0
  } : undefined;

  return {
    summary,
    isLoading: isLoadingStats || isLoadingTodayReviews || isLoadingDueCards || 
               isLoadingMasteredCards || isLoadingTotalCards
  };
};

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
