
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SwarmVisualization } from './SwarmVisualization';
import { quorumForge } from '@/components/tutor/services/QuorumForge';
import SwarmMetricsHeader from './swarm-metrics/SwarmMetricsHeader';
import SwarmMetricsControls from './swarm-metrics/SwarmMetricsControls';
import SwarmMetricsCharts from './swarm-metrics/SwarmMetricsCharts';

const SwarmMetricsTab: React.FC = () => {
  const [period, setPeriod] = useState<'hour' | 'day' | 'week'>('day');
  const [limit, setLimit] = useState<number>(7);
  
  // Fetch recent metrics
  const { data: recentMetrics, isLoading: loadingRecent } = useQuery({
    queryKey: ['swarm-metrics', 'recent'],
    queryFn: () => {
      const swarmMetricsService = quorumForge.getSwarmMetricsService();
      return swarmMetricsService ? swarmMetricsService.getRecentMetrics(20) : [];
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });
  
  // Fetch aggregated metrics
  const { data: aggregatedMetrics, isLoading: loadingAggregated } = useQuery({
    queryKey: ['swarm-metrics', 'aggregated', period, limit],
    queryFn: () => {
      const swarmMetricsService = quorumForge.getSwarmMetricsService();
      return swarmMetricsService ? swarmMetricsService.getAggregatedMetrics(period, limit) : [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Format aggregated data for charts
  const aggregatedChartData = aggregatedMetrics?.map(period => ({
    name: period.period,
    avgSuccessRate: Math.round(period.avgSuccessRate * 100),
    avgFanoutRatio: Number(period.avgFanoutRatio.toFixed(1)),
    avgDuration: Math.round(period.avgDuration),
    tasks: period.totalTasks
  })).reverse();

  const handleLoadMore = () => {
    setLimit(prev => Math.min(prev + 5, 30));
  };
  
  return (
    <div className="space-y-6">
      <SwarmMetricsHeader metricsCount={recentMetrics?.length || 0} />
      
      <div className="flex justify-end">
        <SwarmMetricsControls
          period={period}
          onPeriodChange={setPeriod}
          limit={limit}
          onLoadMore={handleLoadMore}
        />
      </div>
      
      <SwarmVisualization metrics={recentMetrics || []} />
      
      <SwarmMetricsCharts
        chartData={aggregatedChartData || []}
        isLoading={loadingAggregated}
      />
    </div>
  );
};

export default SwarmMetricsTab;
