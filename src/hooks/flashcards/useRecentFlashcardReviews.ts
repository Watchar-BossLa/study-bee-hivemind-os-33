
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

      // First get the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('flashcard_reviews')
        .select('id, flashcard_id, was_correct, response_time_ms, review_time')
        .eq('user_id', user.id)
        .order('review_time', { ascending: false })
        .limit(limit);

      if (reviewsError) throw reviewsError;
      if (!reviewsData) return [];

      // Then get the flashcard details separately to avoid relationship issues
      const flashcardIds = reviewsData.map(r => r.flashcard_id);
      const { data: flashcardsData, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('id, question, subject_area, difficulty')
        .in('id', flashcardIds);

      if (flashcardsError) throw flashcardsError;

      // Combine the data
      const flashcardsMap = new Map(flashcardsData?.map(f => [f.id, f]) || []);
      
      return reviewsData.map(review => ({
        ...review,
        flashcard: flashcardsMap.get(review.flashcard_id) ? {
          question: flashcardsMap.get(review.flashcard_id)!.question,
          subject_area: flashcardsMap.get(review.flashcard_id)!.subject_area,
          difficulty: flashcardsMap.get(review.flashcard_id)!.difficulty,
        } : undefined,
      }));
    },
    enabled: !!user?.id,
    staleTime: 60000, // 1 minute
  });
}
