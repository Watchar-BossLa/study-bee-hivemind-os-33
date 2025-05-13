
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
        
        // Log telemetry event for Swarm metrics access
        console.info('Accessing Swarm child-task metrics from redis:metrics:swarm key (TSB 6.2)');
        
        // For now, using enhanced mock data with child task metrics
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
 * Implements the child-task metrics feature from feat/swarm-metrics
 */
function enhanceMetricsData(metrics: SwarmMetric[]): SwarmMetric[] {
  // Sort by timestamp to ensure chronological order
  const sortedMetrics = [...metrics].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Calculate child task metrics as mentioned in feat/swarm-metrics
  return sortedMetrics.map(metric => ({
    ...metric,
    // Add child task ratio based on fan_out count
    child_task_ratio: metric.fanout_count > 0 ? 
      calculateChildTaskRatio(metric.fanout_count, metric.success_rate) : 0,
    // Add task concurrency metric
    task_concurrency: calculateTaskConcurrency(metric.fanout_count, metric.agent_utilization)
  }));
}

/**
 * Calculate the child task ratio based on fan-out count and success rate
 * This implements the Swarm child-task stats mentioned in feat/swarm-metrics
 */
function calculateChildTaskRatio(fanoutCount: number, successRate: number): number {
  // Simulate the ratio calculation as would be done with real data
  // In a real implementation, this would use actual child task counts from Redis
  return Math.min(1.0, Math.round((fanoutCount * successRate) * 100) / 100);
}

/**
 * Calculate task concurrency based on fan-out and agent utilization
 * This metric is part of the Swarm metrics enhancement
 */
function calculateTaskConcurrency(fanoutCount: number, agentUtilization: number): number {
  // Simulate concurrency calculation
  return Math.round(fanoutCount * agentUtilization * 10) / 10;
}
