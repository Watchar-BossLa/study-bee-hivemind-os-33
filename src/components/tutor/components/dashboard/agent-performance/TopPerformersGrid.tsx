
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AgentPerformanceMetrics } from '@/components/tutor/services/metrics/SwarmMetricsService';

interface TopPerformersGridProps {
  topPerformers: AgentPerformanceMetrics[];
  getSuccessRate: (agent: AgentPerformanceMetrics) => number;
  getInitials: (name: string) => string;
}

const TopPerformersGrid: React.FC<TopPerformersGridProps> = ({
  topPerformers,
  getSuccessRate,
  getInitials
}) => {
  return (
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
  );
};

export default TopPerformersGrid;
