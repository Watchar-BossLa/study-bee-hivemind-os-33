
import { useEffect } from 'react';
import { ArenaMatch, QuizQuestion } from '@/types/arena';

interface MatchTimerEffectProps {
  currentMatch: ArenaMatch | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  matchComplete: boolean;
  selectedAnswer: string | null;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  answerQuestion: (answer: 'none') => void;
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
  // Handle active match timer
  useEffect(() => {
    if (!currentMatch || currentMatch.status !== 'active' || matchComplete || !questions.length) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestionIndex < questions.length - 1) {
            // Move to next question when time runs out
            if (selectedAnswer === null) {
              // Pass 'none' instead of 'x'
              answerQuestion('none'); 
            }
            moveToNextQuestion(questions.length);
            resetTimer();
            return 15;
          } else {
            clearInterval(timer);
            finishMatch();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    currentMatch, 
    currentQuestionIndex, 
    questions.length, 
    matchComplete, 
    finishMatch, 
    selectedAnswer, 
    answerQuestion,
    moveToNextQuestion, 
    resetTimer,
    setTimeLeft
  ]);
};
