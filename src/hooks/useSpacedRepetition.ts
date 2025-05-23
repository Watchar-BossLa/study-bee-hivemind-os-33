
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { calculateNextReview, UserPerformanceMetrics } from '@/utils/spacedRepetition';

export const useSpacedRepetition = (flashcardId: string) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [userMetrics, setUserMetrics] = useState<UserPerformanceMetrics | null>(null);
  const { toast } = useToast();

  // Fetch user performance metrics for RL fine-tuning
  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Get user's flashcard statistics
        const { data: stats } = await supabase
          .from('flashcard_statistics')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (stats) {
          // Calculate average response time from recent reviews
          const { data: reviews } = await supabase
            .from('flashcard_reviews')
            .select('response_time_ms')
            .eq('user_id', user.id)
            .order('review_time', { ascending: false })
            .limit(50);
          
          const validResponseTimes = reviews?.filter(r => r.response_time_ms) || [];
          const avgResponseTime = validResponseTimes.length > 0 
            ? validResponseTimes.reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / validResponseTimes.length 
            : 3000; // Default if no data
          
          setUserMetrics({
            averageResponseTimeMs: avgResponseTime,
            retentionRate: stats.retention_rate || 90,
            totalReviews: stats.total_reviews || 0,
            streakDays: stats.streak_days || 0
          });
        }
      } catch (error) {
        console.error('Error loading user metrics:', error);
      }
    };
    
    fetchUserMetrics();
  }, []);

  const submitReview = useCallback(async (wasCorrect: boolean, responseTimeMs?: number) => {
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
        .select('easiness_factor, consecutive_correct_answers, last_reviewed_at')
        .eq('id', flashcardId)
        .single();

      if (fetchError) throw fetchError;

      // 3. Calculate new values based on the enhanced SM-2⁺ algorithm with RL policy
      const result = calculateNextReview(
        card.consecutive_correct_answers || 0,
        card.easiness_factor || 2.5,
        wasCorrect,
        responseTimeMs,
        userMetrics || undefined
      );

      // 4. Update the flashcard with new values
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          last_reviewed_at: new Date().toISOString(),
          next_review_at: result.nextReviewDate.toISOString(),
          easiness_factor: result.easinessFactor,
          consecutive_correct_answers: result.consecutiveCorrect
        })
        .eq('id', flashcardId);

      if (updateError) throw updateError;
      
      // 5. Run the function to update daily stats (this triggers the DB function)
      try {
        await supabase.rpc('update_daily_flashcard_stats', { user_id_param: user.id });
      } catch (rpcError) {
        // Non-critical error, just log it
        console.error('Error updating daily stats:', rpcError);
      }

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
  }, [flashcardId, toast, userMetrics]);

  return { submitReview, isSubmitting };
};
