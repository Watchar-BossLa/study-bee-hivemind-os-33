
import { useState, useCallback } from 'react';
import { QuizQuestion } from '@/types/arena';
import { arenaQuestionService } from '@/services/arena/arenaQuestionService';
import { supabase } from '@/integrations/supabase/client';

export const useArenaQuestionFetch = (matchId: string | null) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (category?: string) => {
    if (!matchId) {
      setError('No match ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch match details to get the subject focus (if it exists)
      const { data: matchData } = await supabase
        .from('arena_matches')
        .select('subject_focus')
        .eq('id', matchId)
        .single();
      
      // Use subject focus from match if available, otherwise use provided category
      const questionCategory = matchData?.subject_focus || category;
      
      // Fetch questions from our service
      const fetchedQuestions = await arenaQuestionService.fetchQuestions(questionCategory);
      setQuestions(fetchedQuestions);
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
