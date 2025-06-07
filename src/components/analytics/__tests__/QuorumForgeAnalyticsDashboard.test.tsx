
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QuorumForgeAnalyticsDashboard } from '../QuorumForgeAnalyticsDashboard';
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

const mockData = {
  agentMetrics: [
    {
      agentId: 'agent-1',
      agentName: 'MathematicsAgent',
      responseTime: 1500,
      accuracyScore: 0.85,
      consensusParticipation: 0.9,
      tasksCompleted: 75,
      timestamp: Date.now()
    }
  ],
  consensusMetrics: [
    {
      sessionId: 'session-1',
      participantCount: 5,
      consensusReached: true,
      convergenceTime: 15000,
      finalConfidence: 0.88,
      timestamp: Date.now()
    }
  ],
  learningPathMetrics: [
    {
      pathId: 'path-1',
      completionRate: 0.75,
      averageScore: 85,
      dropoffPoints: ['Chapter 3'],
      engagementLevel: 0.8,
      timestamp: Date.now()
    }
  ],
  systemHealth: {
    cpuUsage: 45,
    memoryUsage: 60,
    activeAgents: 20,
    queuedTasks: 5,
    errorRate: 0.02,
    timestamp: Date.now()
  },
  lastUpdated: Date.now()
};

describe('QuorumForgeAnalyticsDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyticsService.fetchAnalyticsData.mockResolvedValue(mockData);
  });

  it('should render dashboard with analytics data', async () => {
    render(<QuorumForgeAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('QuorumForge Analytics')).toBeInTheDocument();
    });

    expect(screen.getByText('Active Agents')).toBeInTheDocument();
    expect(screen.getByText('Consensus Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  it('should switch between tabs correctly', async () => {
    const user = userEvent.setup();
    
    render(<QuorumForgeAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('QuorumForge Analytics')).toBeInTheDocument();
    });

    // Click on consensus patterns tab
    await user.click(screen.getByText('Consensus Patterns'));
    expect(screen.getByText('Consensus Achievement Patterns')).toBeInTheDocument();

    // Click on learning paths tab
    await user.click(screen.getByText('Learning Paths'));
    expect(screen.getByText('Learning Path Effectiveness')).toBeInTheDocument();

    // Click on system health tab
    await user.click(screen.getByText('System Health'));
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });

  it('should toggle real-time updates', async () => {
    const user = userEvent.setup();
    
    render(<QuorumForgeAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('QuorumForge Analytics')).toBeInTheDocument();
    });

    const realtimeSwitch = screen.getByRole('switch');
    expect(realtimeSwitch).toBeChecked();

    await user.click(realtimeSwitch);
    expect(realtimeSwitch).not.toBeChecked();
  });

  it('should refresh data when refresh button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<QuorumForgeAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('QuorumForge Analytics')).toBeInTheDocument();
    });

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    expect(mockAnalyticsService.fetchAnalyticsData).toHaveBeenCalledTimes(2);
  });

  it('should display loading state initially', () => {
    mockAnalyticsService.fetchAnalyticsData.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockData), 1000))
    );

    render(<QuorumForgeAnalyticsDashboard />, { wrapper: createWrapper() });

    expect(screen.getByText('Loading analytics data...')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    mockAnalyticsService.fetchAnalyticsData.mockRejectedValue(new Error('API Error'));

    render(<QuorumForgeAnalyticsDashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
