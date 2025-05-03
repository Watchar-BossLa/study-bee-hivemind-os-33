
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { QuizTimer } from './QuizTimer';

interface QuizHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  category: string;
  difficulty: string;
  timeLeft: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  questionNumber,
  totalQuestions,
  category,
  difficulty,
  timeLeft
}) => {
  const difficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Question {questionNumber} of {totalQuestions}</CardTitle>
        <CardDescription>
          Category: {category} | 
          <span className={difficultyColor()}> {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
        </CardDescription>
      </div>
      <QuizTimer timeLeft={timeLeft} />
    </div>
  );
};
