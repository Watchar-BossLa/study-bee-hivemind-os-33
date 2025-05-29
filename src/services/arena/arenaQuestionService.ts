
import { QuizQuestion } from '@/types/arena';
import { supabase } from '@/integrations/supabase/client';

export class ArenaQuestionService {
  async fetchQuestions(category?: string, limit: number = 10): Promise<QuizQuestion[]> {
    let query = supabase
      .from('quiz_questions')
      .select('*')
      .limit(limit);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions');
    }

    return (data || []) as QuizQuestion[];
  }

  async getRandomQuestions(count: number = 10): Promise<QuizQuestion[]> {
    // For now, just fetch questions randomly
    // In a real implementation, we'd use a proper random sampling method
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .limit(count * 2); // Fetch more to allow for randomization

    if (error) {
      console.error('Error fetching random questions:', error);
      throw new Error('Failed to fetch random questions');
    }

    // Shuffle and return the requested count
    const shuffled = (data || []).sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count) as QuizQuestion[];
  }
}

export const arenaQuestionService = new ArenaQuestionService();
