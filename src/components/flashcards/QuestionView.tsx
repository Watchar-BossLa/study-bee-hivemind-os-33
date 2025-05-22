
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuestionViewProps {
  question: string;
  onShowAnswer: () => void;
  subjectArea?: string | null;
  difficulty?: string | null;
  isPreloaded?: boolean;
}

const QuestionView: React.FC<QuestionViewProps> = ({ 
  question, 
  onShowAnswer, 
  subjectArea, 
  difficulty, 
  isPreloaded 
}) => {
  return (
    <div className="space-y-4">
      {(subjectArea || difficulty || isPreloaded) && (
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {subjectArea && (
            <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
              {subjectArea.charAt(0).toUpperCase() + subjectArea.slice(1)}
            </Badge>
          )}
          {difficulty && (
            <Badge variant="outline" className="bg-secondary/10 hover:bg-secondary/20">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          )}
          {isPreloaded && (
            <Badge variant="outline" className="bg-muted hover:bg-muted/80">
              Preloaded
            </Badge>
          )}
        </div>
      )}

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
