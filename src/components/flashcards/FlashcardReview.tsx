
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import QuestionView from './QuestionView';
import AnswerView from './AnswerView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner'; 

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

  // Fetch additional card details
  const { data: cardDetails } = useQuery({
    queryKey: ['flashcard-details', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcards')
        .select('subject_area, difficulty, is_preloaded, easiness_factor, consecutive_correct_answers')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching card details:", error);
        return { 
          subject_area: null, 
          difficulty: null, 
          is_preloaded: false,
          easiness_factor: 2.5,
          consecutive_correct_answers: 0
        };
      }
      
      return data;
    },
    enabled: !!id
  });

  // Calculate estimated memory strength when card details load
  useEffect(() => {
    if (cardDetails) {
      const ef = cardDetails.easiness_factor || 2.5;
      const consecutive = cardDetails.consecutive_correct_answers || 0;
      
      // Simple memory strength estimation between 0-100%
      let strength = Math.min(100, consecutive * 20);
      
      // Adjust for easiness factor
      if (ef < 2.0) strength *= 0.85;
      if (ef > 2.5) strength *= 1.15;
      
      setMemoryStrength(Math.min(100, Math.max(0, strength)));
    }
  }, [cardDetails]);

  const handleResponse = async (wasCorrect: boolean) => {
    // Calculate response time
    const responseTimeMs = Date.now() - startTime;
    
    await submitReview(wasCorrect, responseTimeMs);
    
    // Show feedback based on response
    if (wasCorrect) {
      if (cardDetails?.consecutive_correct_answers >= 4) {
        toast.success("Great job! You've mastered this card.");
      } else {
        toast.success("Correct! Your memory of this card is getting stronger.");
      }
    } else {
      toast.info("That's okay. Reviewing mistakes helps strengthen memory.");
    }
    
    setIsAnswerVisible(false);
    onComplete();
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
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
