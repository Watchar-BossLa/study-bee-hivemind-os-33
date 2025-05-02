
import { useState, useCallback } from 'react';
import { QuizQuestion } from '@/types/arena';
import { mockQuizQuestions } from '@/data/quizzes/mockQuizzes';

export const useArenaQuestionFetch = (matchId: string | null) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    if (!matchId) {
      setError('No match ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use mock data instead of fetching from database
      // In a real implementation, we would fetch from Supabase
      const fetchedQuestions = [...mockQuizQuestions];
      
      // Shuffle questions for variety
      const shuffled = [...fetchedQuestions].sort(() => 0.5 - Math.random());
      
      setQuestions(shuffled.slice(0, 5)); // Get 5 random questions
    } catch (err) {
      setError('Failed to fetch questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  const resetQuestions = useCallback(() => {
    setQuestions([]);
    setError(null);
  }, []);

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    resetQuestions
  };
};
