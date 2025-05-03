
import { useEffect } from 'react';
import { QuizAnswer, ArenaMatch, MatchPlayer, QuizQuestion } from '@/types/arena';
import { supabase } from '@/integrations/supabase/client';

interface ArenaEffectsProps {
  currentMatch: ArenaMatch | null;
  players: MatchPlayer[];
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
  fetchQuestions: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  resetQuestions: () => void;
  checkForAchievements: (userId: string, matchId: string) => Promise<void>;
  leaveMatch: () => void;
}

export const useArenaEffects = ({
  currentMatch,
  players,
  questions,
  currentQuestionIndex,
  matchComplete,
  selectedAnswer,
  timeLeft,
  setTimeLeft,
  answerQuestion,
  moveToNextQuestion,
  resetTimer,
  finishMatch,
  fetchQuestions,
  fetchUserStats,
  fetchLeaderboard,
  resetQuestions,
  checkForAchievements
}: ArenaEffectsProps) => {
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

  // Fetch questions when match becomes active
  useEffect(() => {
    if (currentMatch?.status === 'active' && questions.length === 0) {
      fetchQuestions();
    }
  }, [currentMatch?.status, questions.length, fetchQuestions]);

  // Handle match completion
  useEffect(() => {
    const handleMatchComplete = async () => {
      if (matchComplete && currentMatch) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await checkForAchievements(user.id, currentMatch.id);
        }
        
        fetchUserStats();
        fetchLeaderboard();
        resetQuestions();
      }
    };

    handleMatchComplete();
  }, [matchComplete, currentMatch, fetchUserStats, fetchLeaderboard, resetQuestions, checkForAchievements]);
};
