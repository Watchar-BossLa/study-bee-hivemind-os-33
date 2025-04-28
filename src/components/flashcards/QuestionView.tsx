
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuestionViewProps {
  question: string;
  onShowAnswer: () => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({ question, onShowAnswer }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Question:</h3>
      <p>{question}</p>
      <Button 
        className="w-full"
        onClick={onShowAnswer}
      >
        Show Answer
      </Button>
    </div>
  );
};

export default QuestionView;
