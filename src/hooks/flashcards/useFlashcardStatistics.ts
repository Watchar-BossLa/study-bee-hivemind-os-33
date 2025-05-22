
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FlashcardStatistics } from '@/types/supabase/flashcard-analytics';

/**
 * Hook to fetch user's flashcard statistics
 */
export const useFlashcardStatistics = () => {
  return useQuery({
    queryKey: ['flashcard-statistics'],
    queryFn: async (): Promise<FlashcardStatistics | null> => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('flashcard_statistics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching statistics:', error);
        return null;
      }
      
      return data;
    }
  });
};
