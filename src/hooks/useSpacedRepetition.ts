
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateNextReview } from '@/utils/spacedRepetition';
import { useToast } from '@/hooks/use-toast';

export const useSpacedRepetition = (flashcardId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitReview = async (wasCorrect: boolean) => {
    try {
      setIsSubmitting(true);

      // Get current flashcard data
      const { data: flashcard, error: fetchError } = await supabase
        .from('flashcards')
        .select('easiness_factor, consecutive_correct_answers')
        .eq('id', flashcardId)
        .single();

      if (fetchError) throw fetchError;

      // Calculate next review parameters
      const result = calculateNextReview(
        flashcard?.easiness_factor || 2.5,
        flashcard?.consecutive_correct_answers || 0,
        wasCorrect
      );

      // Update flashcard with new SRS data
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          easiness_factor: result.easinessFactor,
          consecutive_correct_answers: result.consecutiveCorrect,
          last_reviewed_at: new Date().toISOString(),
          next_review_at: result.nextReviewDate.toISOString()
        })
        .eq('id', flashcardId);

      if (updateError) throw updateError;

      toast({
        description: wasCorrect ? "Great job! Card scheduled for review." : "Keep practicing! Card will be reviewed soon.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update flashcard review status.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReview,
    isSubmitting
  };
};
