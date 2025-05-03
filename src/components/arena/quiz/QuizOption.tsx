
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface QuizOptionProps {
  letter: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean | null;
  onClick: () => void;
  disabled: boolean;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  letter,
  text,
  isSelected,
  isCorrect,
  onClick,
  disabled
}) => {
  const getOptionClass = () => {
    if (isCorrect === null) return '';
    
    if (isCorrect === true) {
      return 'bg-green-100 border-green-500 dark:bg-green-900/30';
    }
    
    if (isSelected && isCorrect === false) {
      return 'bg-red-100 border-red-500 dark:bg-red-900/30';
    }
    
    return '';
  };

  return (
    <Button
      variant="outline"
      className={`justify-start p-4 h-auto text-left ${getOptionClass()}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">{letter}</span>
      {text}
      {isCorrect === true && (
        <Check className="ml-auto h-4 w-4 text-green-500" />
      )}
      {isSelected && isCorrect === false && (
        <X className="ml-auto h-4 w-4 text-red-500" />
      )}
    </Button>
  );
};
