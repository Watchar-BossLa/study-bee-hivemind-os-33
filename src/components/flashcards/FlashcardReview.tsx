
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import QuestionView from './QuestionView';
import AnswerView from './AnswerView';

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
