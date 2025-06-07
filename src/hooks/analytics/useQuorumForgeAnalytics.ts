
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { quorumForgeAnalyticsService, type AnalyticsDashboardData } from '@/services/analytics/QuorumForgeAnalyticsService';

export const useQuorumForgeAnalytics = (realTimeEnabled: boolean = true) => {
  const [realtimeData, setRealtimeData] = useState<AnalyticsDashboardData | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['quorum-forge-analytics'],
    queryFn: () => quorumForgeAnalyticsService.fetchAnalyticsData(),
    refetchInterval: realTimeEnabled ? 5000 : false,
    staleTime: 1000,
  });

  useEffect(() => {
    if (!realTimeEnabled) return;

    const cleanup = quorumForgeAnalyticsService.startRealTimeUpdates((newData) => {
      setRealtimeData(newData);
    });

    return cleanup;
  }, [realTimeEnabled]);

  const currentData = realtimeData || data;

  return {
    data: currentData,
    isLoading: isLoading && !currentData,
    error,
    refetch,
    lastUpdated: currentData?.lastUpdated
  };
};
