
import { useEffect } from 'react';
import { ArenaMatch, QuizQuestion, QuizAnswer } from '@/types/arena';

interface MatchTimerEffectProps {
  currentMatch: ArenaMatch | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  matchComplete: boolean;
  selectedAnswer: string | null;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  answerQuestion: (answer: QuizAnswer) => void;
  moveToNextQuestion: (totalQuestions: number) => boolean;
  resetTimer: () => void;
  finishMatch: () => Promise<void>;
}

export const useMatchTimerEffect = ({
  currentMatch,
  questions,
  currentQuestionIndex,
  matchComplete,
  selectedAnswer,
  timeLeft,
  setTimeLeft,
  answerQuestion,
  moveToNextQuestion,
  resetTimer,
  finishMatch
}: MatchTimerEffectProps) => {
  // Timer effect for countdown
  useEffect(() => {
    if (!currentMatch || matchComplete || currentMatch.status !== 'active' || selectedAnswer) {
      return;
    }

    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          
          // Time's up - auto-select 'none' as answer
          answerQuestion('none');
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    currentMatch, 
    questions, 
    currentQuestionIndex, 
    matchComplete, 
    selectedAnswer, 
    setTimeLeft, 
    answerQuestion
  ]);

  // Effect to handle question progression
  useEffect(() => {
    if (!currentMatch || matchComplete || !selectedAnswer) {
      return;
    }

    const progressTimer = setTimeout(() => {
      const isLastQuestion = !moveToNextQuestion(questions.length);
      
      if (isLastQuestion) {
        finishMatch();
      } else {
        resetTimer();
      }
    }, 2000); // Wait 2 seconds before moving to next question

    return () => clearTimeout(progressTimer);
  }, [
    selectedAnswer, 
    currentMatch, 
    matchComplete, 
    questions.length, 
    moveToNextQuestion, 
    resetTimer, 
    finishMatch
  ]);
};
