
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuorumForgeAnalytics } from '../useQuorumForgeAnalytics';
import { quorumForgeAnalyticsService } from '@/services/analytics/QuorumForgeAnalyticsService';

// Mock the analytics service
jest.mock('@/services/analytics/QuorumForgeAnalyticsService');

const mockAnalyticsService = quorumForgeAnalyticsService as jest.Mocked<typeof quorumForgeAnalyticsService>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useQuorumForgeAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch analytics data on mount', async () => {
    const mockData = {
      agentMetrics: [],
      consensusMetrics: [],
      learningPathMetrics: [],
      systemHealth: {
        cpuUsage: 50,
        memoryUsage: 60,
        activeAgents: 20,
        queuedTasks: 5,
        errorRate: 0.01,
        timestamp: Date.now()
      },
      lastUpdated: Date.now()
    };

    mockAnalyticsService.fetchAnalyticsData.mockResolvedValue(mockData);

    const { result } = renderHook(() => useQuorumForgeAnalytics(false), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockAnalyticsService.fetchAnalyticsData).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Failed to fetch analytics');
    mockAnalyticsService.fetchAnalyticsData.mockRejectedValue(error);

    const { result } = renderHook(() => useQuorumForgeAnalytics(false), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should start real-time updates when enabled', async () => {
    const mockData = {
      agentMetrics: [],
      consensusMetrics: [],
      learningPathMetrics: [],
      systemHealth: {
        cpuUsage: 50,
        memoryUsage: 60,
        activeAgents: 20,
        queuedTasks: 5,
        errorRate: 0.01,
        timestamp: Date.now()
      },
      lastUpdated: Date.now()
    };

    mockAnalyticsService.fetchAnalyticsData.mockResolvedValue(mockData);
    const mockCleanup = jest.fn();
    mockAnalyticsService.startRealTimeUpdates.mockReturnValue(mockCleanup);

    const { result, unmount } = renderHook(() => useQuorumForgeAnalytics(true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockAnalyticsService.startRealTimeUpdates).toHaveBeenCalled();
    });

    unmount();

    expect(mockCleanup).toHaveBeenCalled();
  });

  it('should not start real-time updates when disabled', async () => {
    renderHook(() => useQuorumForgeAnalytics(false), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockAnalyticsService.startRealTimeUpdates).not.toHaveBeenCalled();
    });
  });
});
