
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion, QuizAnswer } from '@/types/arena';
import { calculateScore } from '@/utils/arenaUtils';
import { arenaQuestionService } from '@/services/arena/arenaQuestionService';

export const useArenaAnswerHandler = (matchId: string | null) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const answerQuestion = useCallback(async (
    answer: QuizAnswer, 
    currentQuestion: QuizQuestion,
    timeLeft: number
  ) => {
    if (!matchId) return;
    
    try {
      // Get the auth user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Convert letter answer to actual answer option
      const answerLetter = answer === 'none' ? '' : answer;
      
      // Check if answer is correct
      const isCorrect = answerLetter === currentQuestion.correct_answer;
      
      // Calculate response time (assuming 15 second max time)
      const maxTime = 15;
      const responseTime = maxTime - timeLeft;
      
      // Calculate score based on difficulty and response time
      const scoreToAdd = isCorrect ? calculateScore(currentQuestion.difficulty, responseTime) : 0;
      
      // Update player progress in the match
      const { error } = await supabase.rpc('update_player_progress', {
        match_id_param: matchId,
        user_id_param: user.id,
        score_to_add: scoreToAdd,
        is_correct: isCorrect,
        response_time_param: responseTime
      });
      
      if (error) {
        console.error('Error updating player progress:', error);
      }
      
      // Store answer in database
      await arenaQuestionService.recordAnswer(
        user.id,
        currentQuestion.id,
        isCorrect,
        responseTime
      );
      
      // Update local state
      setSelectedAnswer(answerLetter);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, [matchId]);

  const moveToNextQuestion = useCallback((totalQuestions: number) => {
    if (currentQuestionIndex >= totalQuestions - 1) {
      // No more questions
      return false;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    return true;
  }, [currentQuestionIndex]);

  return {
    currentQuestionIndex,
    selectedAnswer,
    answerQuestion,
    moveToNextQuestion
  };
};
