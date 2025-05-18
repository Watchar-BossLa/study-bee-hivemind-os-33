
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion, QuizAnswer } from '@/types/arena';
import { calculateScore } from '@/utils/arenaUtils';

export const useArenaAnswerHandler = (matchId: string | null) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const answerQuestion = useCallback(async (answer: QuizAnswer, question: QuizQuestion, timeLeft: number) => {
    if (!matchId) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Determine if answer is correct
      const isCorrect = answer === question.correct_answer;
      
      // Calculate score based on difficulty and time taken
      const maxTime = 15; // Max time for a question
      const responseTime = maxTime - timeLeft;
      const scoreToAdd = isCorrect ? calculateScore(question.difficulty, responseTime) : 0;

      // Update player progress
      await supabase.rpc('update_player_progress', {
        match_id_param: matchId,
        user_id_param: user.id,
        score_to_add: scoreToAdd,
        is_correct: isCorrect,
        response_time_param: responseTime
      });

      // Set selected answer for UI updates
      setSelectedAnswer(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, [matchId]);

  const moveToNextQuestion = useCallback((totalQuestions: number): boolean => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      return true;
    }
    return false;
  }, [currentQuestionIndex]);

  return {
    currentQuestionIndex,
    selectedAnswer,
    answerQuestion,
    moveToNextQuestion
  };
};
