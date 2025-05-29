
import { useState, useCallback } from 'react';
import { ArenaMatch, MatchPlayer, QuizQuestion } from '@/types/arena';

export interface ArenaState {
  currentMatch: ArenaMatch | null;
  players: MatchPlayer[];
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  timeLeft: number;
  matchComplete: boolean;
}

export const useArenaState = () => {
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [matchComplete, setMatchComplete] = useState(false);

  const resetArenaState = useCallback(() => {
    setCurrentMatch(null);
    setPlayers([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setMatchComplete(false);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setTimeLeft(30);
  }, []);

  const completeMatch = useCallback(() => {
    setMatchComplete(true);
  }, []);

  return {
    // State
    currentMatch,
    players,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    matchComplete,
    
    // Actions
    setCurrentMatch,
    setPlayers,
    setQuestions,
    setCurrentQuestionIndex,
    setSelectedAnswer,
    setTimeLeft,
    setMatchComplete,
    resetArenaState,
    nextQuestion,
    completeMatch
  };
};
