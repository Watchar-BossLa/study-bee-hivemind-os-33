
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useSpacedRepetition = (flashcardId: string) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const submitReview = async (wasCorrect: boolean, responseTimeMs?: number) => {
    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to save your progress',
          variant: 'destructive',
        });
        return false;
      }

      // 1. Record the review
      const { error: reviewError } = await supabase.from('flashcard_reviews').insert({
        user_id: user.id,
        flashcard_id: flashcardId,
        was_correct: wasCorrect,
        response_time_ms: responseTimeMs || null,
      });

      if (reviewError) throw reviewError;

      // 2. Get the current card data
      const { data: card, error: fetchError } = await supabase
        .from('flashcards')
        .select('easiness_factor, consecutive_correct_answers')
        .eq('id', flashcardId)
        .single();

      if (fetchError) throw fetchError;

      // 3. Calculate new values based on the SM-2 algorithm
      let easinessFactor = card.easiness_factor || 2.5;
      let consecutiveCorrect = card.consecutive_correct_answers || 0;
      let intervalDays = 1;

      if (wasCorrect) {
        consecutiveCorrect += 1;
        
        // Apply SM-2 algorithm
        if (consecutiveCorrect === 1) {
          intervalDays = 1;
        } else if (consecutiveCorrect === 2) {
          intervalDays = 6;
        } else {
          // For subsequent reviews, use the full algorithm
          intervalDays = Math.round((card.consecutive_correct_answers || 0) * easinessFactor);
          easinessFactor = Math.max(1.3, easinessFactor + (0.1 - (5 - 5) * (0.08 + (5 - 5) * 0.02)));
        }
      } else {
        // If incorrect, reset the consecutive counter and reduce easiness
        consecutiveCorrect = 0;
        easinessFactor = Math.max(1.3, easinessFactor - 0.2);
        intervalDays = 1; // Review tomorrow
      }

      // 4. Update the flashcard with new values
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          last_reviewed_at: new Date().toISOString(),
          next_review_at: nextReviewDate.toISOString(),
          easiness_factor: easinessFactor,
          consecutive_correct_answers: consecutiveCorrect
        })
        .eq('id', flashcardId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your review. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitReview, isSubmitting };
};
