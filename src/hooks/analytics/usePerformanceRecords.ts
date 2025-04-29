
import { useQuery } from '@tanstack/react-query';
import { MOCK_PERFORMANCE_RECORDS } from '@/data/analytics/mockPerformanceRecords';
import type { PerformanceRecord } from '@/types/analytics';

export function usePerformanceRecords() {
  return useQuery({
    queryKey: ['performance-records'],
    queryFn: async (): Promise<PerformanceRecord[]> => {
      console.log('Fetching performance records (using mock data for now)');
      // Using mock data until database tables are fully set up
      return MOCK_PERFORMANCE_RECORDS;
    },
  });
}
