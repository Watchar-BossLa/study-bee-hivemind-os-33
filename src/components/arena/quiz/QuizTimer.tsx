
import React from 'react';
import { Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuizTimerProps {
  timeLeft: number;
  maxTime?: number;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ 
  timeLeft, 
  maxTime = 15 
}) => {
  const getTimeLeftClass = () => {
    if (timeLeft <= 5) return 'text-red-500';
    if (timeLeft <= 10) return 'text-yellow-500';
    return '';
  };

  return (
    <>
      <div className={`flex items-center gap-2 rounded-full bg-accent/50 px-3 py-1 ${getTimeLeftClass()}`}>
        <Clock className={`h-4 w-4 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
        <span>{timeLeft}s</span>
      </div>
      <div className="mb-6">
        <Progress value={(timeLeft / maxTime) * 100} className="h-2" />
      </div>
    </>
  );
};
