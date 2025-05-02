
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { quizService } from '@/services/quiz/quizService';
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
      
      // If match has a subject focus, get curriculum-related questions
      if (matchData && 'subject_focus' in matchData && matchData.subject_focus) {
        // Ensure subject_focus is treated as a string
        const subjectFocus = String(matchData.subject_focus);
        
        // First try to get questions from curriculum
        const curriculumQuestions = await fetchCurriculumQuestions(subjectFocus);
        
        if (curriculumQuestions.length >= 5) {
          setQuestions(curriculumQuestions);
          setLoading(false);
          return;
        }
        
        // If not enough curriculum questions, filter by category
        query = query.eq('category', subjectFocus);
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

  // Helper function to fetch questions from curriculum
  const fetchCurriculumQuestions = async (subjectId: string): Promise<QuizQuestion[]> => {
    try {
      // Get relevant curriculum quizzes for the subject
      const { data, error } = await supabase
        .from('curriculum_quizzes')
        .select('*, questions:quiz_questions(*)')
        .eq('subject_id', subjectId)
        .limit(3);  // Limit to 3 quizzes to keep arena matches short
        
      if (error || !data) return [];
      
      // Extract questions from the quizzes
      const allQuestions = data.flatMap(quiz => quiz.questions || []);
      
      // Shuffle and limit the questions
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10) as QuizQuestion[];
    } catch (error) {
      console.error('Error fetching curriculum questions:', error);
      return [];
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
