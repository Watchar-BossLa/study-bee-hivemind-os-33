
import { useQuery } from '@tanstack/react-query';
import { MOCK_STUDY_RECOMMENDATIONS } from '@/data/analytics/mockRecommendations';
import type { StudyRecommendation } from '@/types/analytics';

export function useStudyRecommendations() {
  return useQuery({
    queryKey: ['study-recommendations'],
    queryFn: async (): Promise<StudyRecommendation[]> => {
      console.log('Fetching study recommendations (using mock data for now)');
      return MOCK_STUDY_RECOMMENDATIONS;
    },
  });
}
