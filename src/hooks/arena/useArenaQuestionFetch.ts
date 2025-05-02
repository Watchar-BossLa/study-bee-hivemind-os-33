
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { QuizQuestion } from '@/types/arena';
import { mockQuizQuestions } from '@/data/quizzes/mockQuizzes';

export const useArenaQuestionFetch = (matchId: string | null) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (loading || !matchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get match data to determine if we need subject-specific questions
      const { data: matchData } = await supabase
        .from('arena_matches')
        .select('*')
        .eq('id', matchId)
        .single();
      
      // Use mock questions instead of querying the database
      let filteredQuestions = [...mockQuizQuestions];
      
      // If match has a subject focus, filter mock questions
      if (matchData && 'subject_focus' in matchData && matchData.subject_focus) {
        // Ensure subject_focus is treated as a string
        const subjectFocus = String(matchData.subject_focus);
        
        // Filter by category to simulate database filtering
        filteredQuestions = mockQuizQuestions.filter(q => q.category === subjectFocus);
      }
      
      if (filteredQuestions.length > 0) {
        // Take a random subset of questions
        const questionCount = Math.floor(Math.random() * 6) + 5; // 5-10 questions
        const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, questionCount));
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

  // Helper function to fetch questions from curriculum - using mock data
  const fetchCurriculumQuestions = async (subjectId: string): Promise<QuizQuestion[]> => {
    try {
      // Filter mock questions by category that matches the subject
      const relevantQuestions = mockQuizQuestions.filter(
        q => q.category.toLowerCase() === subjectId.toLowerCase()
      );
      
      // Shuffle and return a limited set
      const shuffled = relevantQuestions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(10, shuffled.length));
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
