
import { useQuery } from '@tanstack/react-query';
import { MOCK_SWARM_METRICS } from '@/data/analytics/mockSwarmMetrics';
import type { SwarmMetric } from '@/types/analytics';

export function useSwarmMetrics() {
  return useQuery({
    queryKey: ['swarm-metrics'],
    queryFn: async (): Promise<SwarmMetric[]> => {
      console.log('Fetching swarm metrics (using mock data for now)');
      // In a real implementation, this would fetch from QuorumForge's metrics service
      return MOCK_SWARM_METRICS;
    },
  });
}
