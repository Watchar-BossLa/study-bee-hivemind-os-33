
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import QuestionView from './QuestionView';
import AnswerView from './AnswerView';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  // Fetch additional card details
  const { data: cardDetails } = useQuery({
    queryKey: ['flashcard-details', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcards')
        .select('subject_area, difficulty, is_preloaded')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching card details:", error);
        return { subject_area: null, difficulty: null, is_preloaded: false };
      }
      
      return data;
    },
    enabled: !!id
  });

  const handleResponse = async (wasCorrect: boolean) => {
    await submitReview(wasCorrect);
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
