
import { useQuery } from '@tanstack/react-query';
import { MOCK_FOCUS_INTERVALS } from '@/data/analytics/mockFocusIntervals';
import type { FocusInterval } from '@/types/analytics';

export function useFocusIntervals() {
  return useQuery({
    queryKey: ['focus-intervals'],
    queryFn: async (): Promise<FocusInterval[]> => {
      console.log('Fetching focus intervals (using mock data for now)');
      return MOCK_FOCUS_INTERVALS;
    },
  });
}
