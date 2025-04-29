
import { useQuery } from '@tanstack/react-query';
import { MOCK_WEAK_AREAS } from '@/data/analytics/mockWeakAreas';
import type { WeakAreaRecommendation } from '@/types/analytics';

export function useWeakAreaRecommendations() {
  return useQuery({
    queryKey: ['weak-area-recommendations'],
    queryFn: async (): Promise<WeakAreaRecommendation[]> => {
      console.log('Fetching weak area recommendations (using mock data for now)');
      return MOCK_WEAK_AREAS;
    },
  });
}
