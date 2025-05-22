
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { calculateNextReview } from '@/utils/spacedRepetition';

export function useSpacedRepetition(flashcardId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const submitReview = useCallback(async (wasCorrect: boolean) => {
    setIsSubmitting(true);
    
    try {
      // Get the current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', flashcardId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to review flashcards",
          variant: "destructive"
        });
        return;
      }
      
      const startTime = new Date();
      const responseTimeMs = Math.floor(startTime.getTime() - (new Date().getTime() - 5000)); // Approx 5 seconds for review
      
      // Record the review
      const { error: reviewError } = await supabase
        .from('flashcard_reviews')
        .insert({
          flashcard_id: flashcardId,
          user_id: user.id,
          was_correct: wasCorrect,
          response_time_ms: responseTimeMs,
          confidence_level: wasCorrect ? 3 : 1
        });
      
      if (reviewError) throw reviewError;
        
      // Check if this is a preloaded card
      if (flashcard.is_preloaded) {
        // For preloaded cards, first check if the user already has a copy
        const { data: existingCopy, error: copyCheckError } = await supabase
          .from('flashcards')
          .select('id')
          .eq('user_id', user.id)
          .eq('question', flashcard.question)
          .maybeSingle();
          
        if (copyCheckError) throw copyCheckError;
        
        if (!existingCopy) {
          // Calculate initial review values for the new card
          const reviewResult = calculateNextReview(0, 2.5, wasCorrect);
          
          // Clone the preloaded card for this user if they don't have a copy yet
          const { error: cloneError } = await supabase
            .from('flashcards')
            .insert({
              user_id: user.id,
              question: flashcard.question,
              answer: flashcard.answer,
              subject_area: flashcard.subject_area,
              difficulty: flashcard.difficulty,
              is_preloaded: false,
              consecutive_correct_answers: reviewResult.consecutiveCorrect,
              easiness_factor: reviewResult.easinessFactor,
              next_review_at: reviewResult.nextReviewDate.toISOString()
            });
            
          if (cloneError) throw cloneError;
          
          toast({
            title: "Card added to your collection",
            description: "This preloaded card has been added to your personal collection.",
            duration: 3000
          });
        }
        
        // For preloaded cards, we don't update the original
        setIsSubmitting(false);
        return;
      }
      
      // Calculate new values based on spaced repetition algorithm
      const newConsecutiveCorrectAnswers = wasCorrect
        ? (flashcard.consecutive_correct_answers || 0) + 1
        : 0;
        
      const newEasinessFactor = flashcard.easiness_factor || 2.5;
      
      // Calculate the next review date
      const reviewResult = calculateNextReview(
        flashcard.consecutive_correct_answers || 0,
        newEasinessFactor,
        wasCorrect
      );
      
      // Update the flashcard
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          consecutive_correct_answers: reviewResult.consecutiveCorrect,
          easiness_factor: reviewResult.easinessFactor,
          last_reviewed_at: new Date().toISOString(),
          next_review_at: reviewResult.nextReviewDate.toISOString()
        })
        .eq('id', flashcardId);
        
      if (updateError) throw updateError;
      
      // Call the function to update user's statistics
      const { error: statsError } = await supabase.rpc('update_daily_flashcard_stats', {
        user_id_param: user.id
      });
      
      if (statsError) console.error("Failed to update stats:", statsError);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [flashcardId, toast]);
  
  return { submitReview, isSubmitting };
}
