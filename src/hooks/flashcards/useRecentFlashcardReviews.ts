
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FlashcardReview {
  id: string;
  flashcard_id: string;
  was_correct: boolean;
  response_time_ms: number | null;
  review_time: string;
  flashcard?: {
    question: string;
    subject_area: string | null;
    difficulty: string | null;
  };
}

export function useRecentFlashcardReviews(limit: number = 100) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-flashcard-reviews', user?.id, limit],
    queryFn: async (): Promise<FlashcardReview[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select(`
          id,
          flashcard_id,
          was_correct,
          response_time_ms,
          review_time,
          flashcard:flashcards(
            question,
            subject_area,
            difficulty
          )
        `)
        .eq('user_id', user.id)
        .order('review_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 60000, // 1 minute
  });
}
