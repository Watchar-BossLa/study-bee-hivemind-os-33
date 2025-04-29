
import { useQuery } from '@tanstack/react-query';
import { MOCK_SUBJECT_PROGRESS } from '@/data/analytics/mockSubjectProgress';
import type { SubjectProgress } from '@/types/analytics';

export function useSubjectProgress() {
  return useQuery({
    queryKey: ['subject-progress'],
    queryFn: async (): Promise<SubjectProgress[]> => {
      console.log('Fetching subject progress (using mock data for now)');
      return MOCK_SUBJECT_PROGRESS;
    },
  });
}
