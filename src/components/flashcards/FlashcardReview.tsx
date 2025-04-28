
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { Check, X } from 'lucide-react';

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
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Question:</h3>
          <p>{question}</p>
          
          {!isAnswerVisible ? (
            <Button 
              className="w-full"
              onClick={() => setIsAnswerVisible(true)}
            >
              Show Answer
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Answer:</h3>
                <p>{answer}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleResponse(false)}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  Incorrect
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleResponse(true)}
                  disabled={isSubmitting}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Correct
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashcardReview;
