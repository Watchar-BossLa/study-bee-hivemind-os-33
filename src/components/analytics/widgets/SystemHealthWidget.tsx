
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Cpu, HardDrive, Users, Clock } from 'lucide-react';
import type { SystemHealthMetrics } from '@/services/analytics/QuorumForgeAnalyticsService';

interface SystemHealthWidgetProps {
  data: SystemHealthMetrics;
}

export const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({ data }) => {
  const getHealthStatus = () => {
    const overallHealth = (
      (1 - data.cpuUsage / 100) * 0.3 +
      (1 - data.memoryUsage / 100) * 0.3 +
      (1 - data.errorRate) * 0.4
    ) * 100;

    if (overallHealth >= 80) return { status: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (overallHealth >= 60) return { status: 'Good', color: 'bg-yellow-500', icon: AlertTriangle };
    return { status: 'Needs Attention', color: 'bg-red-500', icon: AlertTriangle };
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HealthIcon className="h-5 w-5" />
            <span>System Status</span>
            <Badge className={healthStatus.color}>
              {healthStatus.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Active Agents</p>
                <p className="text-2xl font-bold">{data.activeAgents}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Queued Tasks</p>
                <p className="text-2xl font-bold">{data.queuedTasks}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(data.cpuUsage)}%
              </span>
            </div>
            <Progress value={data.cpuUsage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.round(data.memoryUsage)}%
              </span>
            </div>
            <Progress value={data.memoryUsage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Error Rate</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {(data.errorRate * 100).toFixed(2)}%
              </span>
            </div>
            <Progress value={data.errorRate * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
