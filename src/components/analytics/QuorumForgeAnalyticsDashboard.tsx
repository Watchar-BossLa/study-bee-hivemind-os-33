
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RefreshCw, Activity, Users, Brain, TrendingUp } from 'lucide-react';
import { useQuorumForgeAnalytics } from '@/hooks/analytics/useQuorumForgeAnalytics';
import { AgentPerformanceChart } from './charts/AgentPerformanceChart';
import { ConsensusPatternChart } from './charts/ConsensusPatternChart';
import { LearningPathChart } from './charts/LearningPathChart';
import { SystemHealthWidget } from './widgets/SystemHealthWidget';
import { MetricCard } from './widgets/MetricCard';

export const QuorumForgeAnalyticsDashboard: React.FC = () => {
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const { data, isLoading, error, refetch, lastUpdated } = useQuorumForgeAnalytics(realTimeEnabled);

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading analytics data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load analytics data</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const overviewMetrics = {
    activeAgents: data.systemHealth.activeAgents,
    consensusRate: Math.round(
      (data.consensusMetrics.filter(m => m.consensusReached).length / data.consensusMetrics.length) * 100
    ),
    avgResponseTime: Math.round(
      data.agentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / data.agentMetrics.length
    ),
    systemHealth: Math.round((1 - data.systemHealth.errorRate) * 100)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QuorumForge Analytics</h1>
          <p className="text-muted-foreground">
            Real-time insights into agent performance and consensus patterns
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="realtime">Real-time</Label>
            <Switch
              id="realtime"
              checked={realTimeEnabled}
              onCheckedChange={setRealTimeEnabled}
            />
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {lastUpdated && (
            <Badge variant="secondary">
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Agents"
          value={overviewMetrics.activeAgents}
          icon={<Users className="h-4 w-4" />}
          trend="+2 from last hour"
          trendUp={true}
        />
        <MetricCard
          title="Consensus Rate"
          value={`${overviewMetrics.consensusRate}%`}
          icon={<Brain className="h-4 w-4" />}
          trend="+5% from yesterday"
          trendUp={true}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${overviewMetrics.avgResponseTime}ms`}
          icon={<Activity className="h-4 w-4" />}
          trend="-50ms improvement"
          trendUp={true}
        />
        <MetricCard
          title="System Health"
          value={`${overviewMetrics.systemHealth}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="Stable"
          trendUp={true}
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="consensus">Consensus Patterns</TabsTrigger>
          <TabsTrigger value="learning">Learning Paths</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <AgentPerformanceChart data={data.agentMetrics} metric="responseTime" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Agent Accuracy Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <AgentPerformanceChart data={data.agentMetrics} metric="accuracyScore" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consensus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consensus Achievement Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <ConsensusPatternChart data={data.consensusMetrics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <LearningPathChart data={data.learningPathMetrics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemHealthWidget data={data.systemHealth} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
