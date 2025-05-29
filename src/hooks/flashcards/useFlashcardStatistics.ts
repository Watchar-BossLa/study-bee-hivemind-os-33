
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FlashcardStatistics {
  total_cards: number;
  cards_due: number;
  cards_learned: number;
  cards_mastered: number;
  total_reviews: number;
  correct_reviews: number;
  retention_rate: number;
  average_interval: number;
  streak_days: number;
  last_study_date: string | null;
  updated_at: string;
}

export function useFlashcardStatistics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['flashcard-statistics', user?.id],
    queryFn: async (): Promise<FlashcardStatistics | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('flashcard_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}
