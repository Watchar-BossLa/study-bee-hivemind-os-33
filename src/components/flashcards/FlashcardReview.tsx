
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import QuestionView from './QuestionView';
import AnswerView from './AnswerView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner'; 
import { logger } from '@/services/logger/logger';
import { captureException } from '@/services/monitoring/sentry';

interface FlashcardReviewProps {
  id: string;
  question: string;
  answer: string;
  onComplete: () => void;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  id,
  question,
  answer,
  onComplete
}) => {
  const [isAnswerVisible, setIsAnswerVisible] = React.useState(false);
  const { submitReview, isSubmitting } = useSpacedRepetition(id);
  const [startTime] = React.useState(Date.now());
  const [memoryStrength, setMemoryStrength] = useState<number | null>(null);

  // Fetch additional card details with error handling
  const { data: cardDetails, error: cardError } = useQuery({
    queryKey: ['flashcard-details', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('flashcards')
          .select('subject_area, difficulty, is_preloaded, easiness_factor, consecutive_correct_answers')
          .eq('id', id)
          .single();
        
        if (error) {
          logger.error('Error fetching card details', { error, cardId: id });
          return { 
            subject_area: null, 
            difficulty: null, 
            is_preloaded: false,
            easiness_factor: 2.5,
            consecutive_correct_answers: 0
          };
        }
        
        return data;
      } catch (error) {
        captureException(error as Error, { context: 'flashcard-details-fetch', cardId: id });
        throw error;
      }
    },
    enabled: !!id,
    retry: 2,
    staleTime: 60000, // 1 minute
  });

  // Log card error for monitoring
  useEffect(() => {
    if (cardError) {
      logger.error('Failed to load flashcard details', { 
        error: cardError, 
        cardId: id 
      });
    }
  }, [cardError, id]);

  // Calculate estimated memory strength when card details load
  useEffect(() => {
    if (cardDetails) {
      const ef = cardDetails.easiness_factor || 2.5;
      const consecutive = cardDetails.consecutive_correct_answers || 0;
      
      // Enhanced memory strength estimation
      let strength = Math.min(100, consecutive * 18);
      
      // Adjust for easiness factor with more nuanced scaling
      if (ef < 1.8) strength *= 0.8;
      else if (ef < 2.0) strength *= 0.9;
      else if (ef > 2.8) strength *= 1.2;
      else if (ef > 2.5) strength *= 1.1;
      
      // Apply learning curve bonus for established cards
      if (consecutive >= 3) {
        strength += Math.min(15, (consecutive - 2) * 3);
      }
      
      const finalStrength = Math.min(100, Math.max(0, strength));
      setMemoryStrength(finalStrength);
      
      logger.debug('Memory strength calculated', {
        cardId: id,
        consecutiveCorrect: consecutive,
        easinessFactor: ef,
        memoryStrength: finalStrength
      });
    }
  }, [cardDetails, id]);

  const handleResponse = async (wasCorrect: boolean) => {
    try {
      // Calculate response time with validation
      const responseTimeMs = Math.max(100, Date.now() - startTime); // Minimum 100ms
      
      logger.info('Flashcard response submitted', {
        cardId: id,
        wasCorrect,
        responseTime: responseTimeMs,
        memoryStrength,
        subject: cardDetails?.subject_area
      });
      
      const success = await submitReview(wasCorrect, responseTimeMs);
      
      if (success) {
        // Enhanced feedback based on response and performance
        if (wasCorrect) {
          const consecutive = (cardDetails?.consecutive_correct_answers || 0) + 1;
          if (consecutive >= 5) {
            toast.success("Excellent! You've mastered this card. 🎯", {
              description: `${consecutive} correct answers in a row!`
            });
          } else if (consecutive >= 3) {
            toast.success("Great progress! Keep it up! 📈", {
              description: "Your memory of this card is strengthening."
            });
          } else {
            toast.success("Correct! Well done! ✅");
          }
        } else {
          toast.info("That's okay - mistakes help us learn! 💡", {
            description: "This card will be reviewed again soon."
          });
        }
        
        // Reset state and complete
        setIsAnswerVisible(false);
        onComplete();
      } else {
        toast.error("Failed to save your progress. Please try again.");
      }
    } catch (error) {
      logger.error('Error handling flashcard response', {
        error,
        cardId: id,
        wasCorrect
      });
      
      captureException(error as Error, {
        context: 'flashcard-response-handling',
        cardId: id,
        wasCorrect
      });
      
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg">
      <CardContent className="p-6">
        {!isAnswerVisible ? (
          <QuestionView 
            question={question} 
            onShowAnswer={() => setIsAnswerVisible(true)} 
            subjectArea={cardDetails?.subject_area}
            difficulty={cardDetails?.difficulty}
            isPreloaded={cardDetails?.is_preloaded}
            memoryStrength={memoryStrength}
          />
        ) : (
          <AnswerView 
            answer={answer}
            isSubmitting={isSubmitting}
            onResponse={handleResponse}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardReview;
