
import { useQuery } from '@tanstack/react-query';
import { MOCK_STUDY_METRICS } from '@/data/analytics/mockStudyMetrics';
import type { StudyMetrics } from '@/types/analytics';

export function useStudyMetrics() {
  return useQuery({
    queryKey: ['study-metrics'],
    queryFn: async (): Promise<StudyMetrics[]> => {
      console.log('Fetching study metrics (using mock data for now)');
      // Using mock data until database tables are fully set up
      return MOCK_STUDY_METRICS;
    },
  });
}
