import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { quorumForge } from '@/components/tutor/services/QuorumForge';
import { AgentPerformanceMetrics } from '@/components/tutor/services/metrics/SwarmMetricsService';
import TopPerformersGrid from './agent-performance/TopPerformersGrid';
import AgentPerformanceGrid from './agent-performance/AgentPerformanceGrid';

const AgentPerformanceTab: React.FC = () => {
  const { data: agentMetrics, isLoading } = useQuery({
    queryKey: ['agent-performance-metrics'],
    queryFn: () => {
      const councilService = quorumForge.getAgentService();
      // For now, generate mock data since we need to integrate with the actual service
      const mockMetrics: AgentPerformanceMetrics[] = [
        {
          agentId: 'content-expert',
          agentName: 'Content Expert',
          totalTasks: 145,
          successfulTasks: 132,
          averageResponseTime: 850,
          userRating: 4.7,
          lastActive: new Date(Date.now() - 300000),
          specialization: ['Mathematics', 'Science', 'Content Delivery'],
          collaborationScore: 0.92
        },
        {
          agentId: 'learning-strategist',
          agentName: 'Learning Strategist',
          totalTasks: 98,
          successfulTasks: 89,
          averageResponseTime: 1200,
          userRating: 4.5,
          lastActive: new Date(Date.now() - 180000),
          specialization: ['Study Planning', 'Learning Paths', 'Strategy'],
          collaborationScore: 0.88
        },
        {
          agentId: 'assessment-expert',
          agentName: 'Assessment Expert',
          totalTasks: 76,
          successfulTasks: 71,
          averageResponseTime: 950,
          userRating: 4.6,
          lastActive: new Date(Date.now() - 600000),
          specialization: ['Testing', 'Evaluation', 'Progress Tracking'],
          collaborationScore: 0.85
        },
        {
          agentId: 'engagement-specialist',
          agentName: 'Engagement Specialist',
          totalTasks: 123,
          successfulTasks: 110,
          averageResponseTime: 750,
          userRating: 4.8,
          lastActive: new Date(Date.now() - 120000),
          specialization: ['Motivation', 'Gamification', 'User Experience'],
          collaborationScore: 0.94
        },
        {
          agentId: 'metacognition-coach',
          agentName: 'Metacognition Coach',
          totalTasks: 67,
          successfulTasks: 61,
          averageResponseTime: 1100,
          userRating: 4.4,
          lastActive: new Date(Date.now() - 900000),
          specialization: ['Self-Reflection', 'Learning Awareness', 'Study Skills'],
          collaborationScore: 0.82
        }
      ];
      return mockMetrics;
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const getSuccessRate = (agent: AgentPerformanceMetrics) => {
    return agent.totalTasks > 0 ? (agent.successfulTasks / agent.totalTasks) * 100 : 0;
  };

  const getActivityStatus = (lastActive: Date) => {
    const minutesAgo = (Date.now() - lastActive.getTime()) / (1000 * 60);
    if (minutesAgo < 5) return { status: 'online', color: 'bg-green-500' };
    if (minutesAgo < 15) return { status: 'recent', color: 'bg-yellow-500' };
    return { status: 'away', color: 'bg-gray-400' };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading agent performance metrics...</p>
        </div>
      </div>
    );
  }

  if (!agentMetrics || agentMetrics.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No agent performance data available</p>
        </div>
      </div>
    );
  }

  const topPerformers = [...agentMetrics]
    .sort((a, b) => getSuccessRate(b) - getSuccessRate(a))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Performance Dashboard</h2>
        <Badge variant="outline" className="text-sm">
          {agentMetrics.length} Active Agents
        </Badge>
      </div>

      {/* Top Performers Overview */}
      <TopPerformersGrid
        topPerformers={topPerformers}
        getSuccessRate={getSuccessRate}
        getInitials={getInitials}
      />

      {/* Detailed Agent Metrics */}
      <AgentPerformanceGrid
        agentMetrics={agentMetrics}
        getSuccessRate={getSuccessRate}
        getActivityStatus={getActivityStatus}
        getInitials={getInitials}
      />
    </div>
  );
};

export default AgentPerformanceTab;
