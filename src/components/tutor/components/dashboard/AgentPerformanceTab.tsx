
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { quorumForge } from '@/components/tutor/services/QuorumForge';
import { AgentPerformanceMetrics } from '@/components/tutor/services/metrics/SwarmMetricsService';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topPerformers.map((agent, index) => (
          <Card key={agent.agentId} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  #{index + 1} Top Performer
                </CardTitle>
                <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                  {getSuccessRate(agent).toFixed(1)}% Success
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm font-medium">
                    {getInitials(agent.agentName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{agent.agentName}</p>
                  <p className="text-xs text-muted-foreground">
                    {agent.totalTasks} tasks completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Agent Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agentMetrics.map((agent) => {
          const activityStatus = getActivityStatus(agent.lastActive);
          const successRate = getSuccessRate(agent);

          return (
            <Card key={agent.agentId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="font-medium">
                          {getInitials(agent.agentName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${activityStatus.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.agentName}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {activityStatus.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tasks Completed</span>
                      <span className="font-medium">{agent.totalTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Successful</span>
                      <span className="font-medium text-green-600">{agent.successfulTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">User Rating</span>
                      <span className="font-medium">★ {agent.userRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Response</span>
                      <span className="font-medium">{agent.averageResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Collaboration</span>
                      <span className="font-medium">{Math.round(agent.collaborationScore * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Success Rate Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-medium">{successRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={successRate} className="h-2" />
                </div>

                {/* Collaboration Score Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Collaboration Score</span>
                    <span className="font-medium">{Math.round(agent.collaborationScore * 100)}%</span>
                  </div>
                  <Progress value={agent.collaborationScore * 100} className="h-2" />
                </div>

                {/* Specializations */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialization.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPerformanceTab;
