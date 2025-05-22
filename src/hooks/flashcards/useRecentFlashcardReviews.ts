
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch user's recent flashcard reviews with optional limit
 */
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
