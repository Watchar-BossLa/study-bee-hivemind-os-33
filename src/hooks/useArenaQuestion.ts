
import { useArenaQuestionFetch } from './arena/useArenaQuestionFetch';
import { useArenaAnswerHandler } from './arena/useArenaAnswerHandler';
import { useArenaTimer } from './arena/useArenaTimer';
import type { QuizAnswer } from '@/types/arena';

export const useArenaQuestion = (matchId: string | null) => {
  const { 
    questions,
    loading,
    error,
    fetchQuestions,
    resetQuestions
  } = useArenaQuestionFetch(matchId);

  const {
    currentQuestionIndex,
    selectedAnswer,
    answerQuestion: handleAnswer,
    moveToNextQuestion
  } = useArenaAnswerHandler(matchId);

  const {
    timeLeft,
    setTimeLeft,
    resetTimer
  } = useArenaTimer();

  const answerQuestion = (answer: QuizAnswer) => {
    if (!questions.length) return;
    handleAnswer(answer, questions[currentQuestionIndex], timeLeft);
  };

  return {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    loading,
    error,
    setTimeLeft,
    fetchQuestions,
    answerQuestion,
    resetQuestions,
    moveToNextQuestion,
    resetTimer
  };
};
