
import { useQuery } from '@tanstack/react-query';
import { MOCK_SWARM_METRICS } from '@/data/analytics/mockSwarmMetrics';
import type { SwarmMetric } from '@/types/analytics';

export function useSwarmMetrics() {
  return useQuery({
    queryKey: ['swarm-metrics'],
    queryFn: async (): Promise<SwarmMetric[]> => {
      console.log('Fetching swarm metrics from QuorumForge metrics service');
      
      try {
        // In a real implementation, this would fetch from QuorumForge's metrics service
        // Example API call would be:
        // const response = await fetch('/api/metrics/swarm');
        // if (!response.ok) throw new Error('Failed to fetch swarm metrics');
        // return await response.json();
        
        // For now, using enhanced mock data
        return enhanceMetricsData(MOCK_SWARM_METRICS);
      } catch (error) {
        console.error('Error fetching swarm metrics:', error);
        throw new Error('Failed to fetch swarm metrics data');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Enhances the metrics data with additional calculated fields
 * This simulates the data transformations that would happen with real data
 */
function enhanceMetricsData(metrics: SwarmMetric[]): SwarmMetric[] {
  // Sort by timestamp to ensure chronological order
  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  return sortedMetrics;
}
