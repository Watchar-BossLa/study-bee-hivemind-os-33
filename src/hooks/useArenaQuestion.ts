
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateScore } from '@/utils/arenaUtils';
import type { QuizQuestion } from '@/types/arena';

export const useArenaQuestion = (matchId: string | null) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const fetchQuestions = async () => {
    try {
      const { data: questionData } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at')
        .limit(5);

      if (questionData) {
        const typedQuestions: QuizQuestion[] = questionData.map(q => ({
          id: q.id,
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer,
          difficulty: q.difficulty,
          category: q.category
        }));
        
        setQuestions(typedQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const answerQuestion = async (answer: 'a' | 'b' | 'c' | 'd') => {
    if (!matchId || selectedAnswer || currentQuestionIndex >= questions.length) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const scoreToAdd = isCorrect ? calculateScore(currentQuestion.difficulty) : 0;
      
      await supabase.rpc('update_player_progress', {
        match_id_param: matchId,
        user_id_param: user.id,
        score_to_add: scoreToAdd,
        is_correct: isCorrect
      });

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setTimeLeft(15);
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const resetQuestions = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(15);
  };

  return {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    setTimeLeft,
    fetchQuestions,
    answerQuestion,
    resetQuestions
  };
};
