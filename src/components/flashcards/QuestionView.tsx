
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain } from 'lucide-react';

interface QuestionViewProps {
  question: string;
  onShowAnswer: () => void;
  subjectArea?: string | null;
  difficulty?: string | null;
  isPreloaded?: boolean;
  memoryStrength?: number | null;
}

const QuestionView: React.FC<QuestionViewProps> = ({ 
  question, 
  onShowAnswer, 
  subjectArea, 
  difficulty, 
  isPreloaded,
  memoryStrength
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

      {memoryStrength !== null && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Brain className="h-3 w-3" /> Memory Strength
            </span>
            <span>{Math.round(memoryStrength)}%</span>
          </div>
          <Progress value={memoryStrength} className="h-1" />
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
