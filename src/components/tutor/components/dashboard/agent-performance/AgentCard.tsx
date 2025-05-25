
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AgentPerformanceMetrics } from '@/components/tutor/services/metrics/SwarmMetricsService';

interface AgentCardProps {
  agent: AgentPerformanceMetrics;
  getSuccessRate: (agent: AgentPerformanceMetrics) => number;
  getActivityStatus: (lastActive: Date) => { status: string; color: string };
  getInitials: (name: string) => string;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  getSuccessRate,
  getActivityStatus,
  getInitials
}) => {
  const activityStatus = getActivityStatus(agent.lastActive);
  const successRate = getSuccessRate(agent);

  return (
    <Card>
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
};

export default AgentCard;
