
import { useMatchTimerEffect } from './useMatchTimerEffect';
import { useQuestionsLoadEffect } from './useQuestionsLoadEffect';
import { useMatchCompletionEffect } from './useMatchCompletionEffect';
import { QuizAnswer, ArenaMatch, MatchPlayer, QuizQuestion } from '@/types/arena';

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

export const useArenaEffects = (props: ArenaEffectsProps) => {
  // Use the refactored effect hooks
  useMatchTimerEffect({
    currentMatch: props.currentMatch,
    questions: props.questions,
    currentQuestionIndex: props.currentQuestionIndex,
    matchComplete: props.matchComplete,
    selectedAnswer: props.selectedAnswer,
    timeLeft: props.timeLeft,
    setTimeLeft: props.setTimeLeft,
    answerQuestion: props.answerQuestion,
    moveToNextQuestion: props.moveToNextQuestion,
    resetTimer: props.resetTimer,
    finishMatch: props.finishMatch
  });

  useQuestionsLoadEffect({
    currentMatch: props.currentMatch,
    questions: props.questions,
    fetchQuestions: props.fetchQuestions
  });

  useMatchCompletionEffect({
    currentMatch: props.currentMatch,
    matchComplete: props.matchComplete,
    checkForAchievements: props.checkForAchievements,
    fetchUserStats: props.fetchUserStats,
    fetchLeaderboard: props.fetchLeaderboard,
    resetQuestions: props.resetQuestions
  });
};
