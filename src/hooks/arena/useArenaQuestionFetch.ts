
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { QuizQuestion } from '@/types/arena';

export const useArenaQuestionFetch = (matchId: string | null) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (loading || !matchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data: matchData } = await supabase
        .from('arena_matches')
        .select('*')
        .eq('id', matchId)
        .single();
      
      let query = supabase
        .from('quiz_questions')
        .select('*')
        .order('id');
      
      if (matchData && 'subject_focus' in matchData && matchData.subject_focus) {
        query = query.eq('category', matchData.subject_focus);
      }
      
      const questionCount = Math.floor(Math.random() * 6) + 5; // 5-10 questions
      const { data: questionData } = await query.limit(questionCount);

      if (questionData && questionData.length > 0) {
        setQuestions(questionData as QuizQuestion[]);
      } else {
        // Fallback questions
        setQuestions([
          {
            id: 'fallback',
            question: 'What is the main goal of education?',
            option_a: 'To pass exams',
            option_b: 'To gain knowledge and develop skills',
            option_c: 'To get a degree',
            option_d: 'To satisfy requirements',
            correct_answer: 'b',
            difficulty: 'medium',
            category: 'Education'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const resetQuestions = () => {
    setQuestions([]);
    setError(null);
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    resetQuestions
  };
};
