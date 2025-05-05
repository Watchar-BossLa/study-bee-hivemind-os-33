
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
      let questionCategory = category;
      try {
        const { data: matchData, error: matchError } = await supabase
          .from('arena_matches')
          .select('*')
          .eq('id', matchId)
          .single();
        
        // Only use subject_focus if it exists in the returned data
        if (!matchError && matchData && 'subject_focus' in matchData) {
          // Type assertion to handle the unknown type
          const subjectFocus = matchData.subject_focus as string | null;
          questionCategory = subjectFocus || category;
        }
      } catch (err) {
        console.error('Error checking match data:', err);
        // Continue with provided category if there's an error
      }
      
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
