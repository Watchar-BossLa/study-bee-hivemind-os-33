
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateScore } from '@/utils/arenaUtils';
import type { QuizQuestion, QuizAnswer, UpdatePlayerProgressParams } from '@/types/arena';

export const useArenaAnswerHandler = (matchId: string | null) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const answerQuestion = async (
    answer: QuizAnswer,
    currentQuestion: QuizQuestion,
    timeLeft: number
  ) => {
    if (!matchId || selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer !== 'none' && answer === currentQuestion.correct_answer;
    const responseTime = 15 - timeLeft;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const scoreToAdd = (isCorrect && answer !== 'none') 
        ? calculateScore(currentQuestion.difficulty, responseTime) 
        : 0;
      
      await supabase.rpc('update_player_progress', {
        match_id_param: matchId,
        user_id_param: user.id,
        score_to_add: scoreToAdd,
        is_correct: isCorrect,
        response_time_param: responseTime
      } as UpdatePlayerProgressParams);

      await supabase.from('quiz_questions')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', currentQuestion.id);

    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const moveToNextQuestion = (totalQuestions: number) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      return true;
    }
    return false;
  };

  return {
    currentQuestionIndex,
    selectedAnswer,
    answerQuestion,
    moveToNextQuestion
  };
};
