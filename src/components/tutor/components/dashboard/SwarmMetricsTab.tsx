
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwarmMetricsRecord, AggregatedSwarmMetrics } from '@/components/tutor/services/metrics/SwarmMetricsService';
import { SwarmVisualization } from './SwarmVisualization';
import { quorumForge } from '@/components/tutor/services/QuorumForge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SwarmMetricsTab: React.FC = () => {
  const [period, setPeriod] = useState<'hour' | 'day' | 'week'>('day');
  const [limit, setLimit] = useState<number>(7);
  
  // Fetch recent metrics
  const { data: recentMetrics, isLoading: loadingRecent } = useQuery({
    queryKey: ['swarm-metrics', 'recent'],
    queryFn: () => {
      const councilService = quorumForge.getMCPCore()?.getAgents().length > 0 
        ? quorumForge.getCouncils()
        : undefined;
      
      if (councilService) {
        return councilService.getSwarmMetrics().slice(-20); // Get the last 20 records
      }
      return [];
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });
  
  // Fetch aggregated metrics
  const { data: aggregatedMetrics, isLoading: loadingAggregated } = useQuery({
    queryKey: ['swarm-metrics', 'aggregated', period, limit],
    queryFn: () => {
      const councilService = quorumForge.getMCPCore()?.getAgents().length > 0 
        ? quorumForge.getCouncils()
        : undefined;
      
      if (councilService) {
        return councilService.getAggregatedSwarmMetrics(period, limit);
      }
      return [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
  
  // Format aggregated data for charts
  const aggregatedChartData = aggregatedMetrics?.map(period => ({
    name: period.period,
    avgSuccessRate: Math.round(period.avgSuccessRate * 100),
    avgFanoutRatio: Number(period.avgFanoutRatio.toFixed(1)),
    avgDuration: Math.round(period.avgDurationMs),
    tasks: period.totalTasks
  })).reverse();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Swarm Metrics Dashboard</h2>
        <div className="flex items-center gap-4">
          <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as any)}>
            <TabsList>
              <TabsTrigger value="hour">Hourly</TabsTrigger>
              <TabsTrigger value="day">Daily</TabsTrigger>
              <TabsTrigger value="week">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            onClick={() => setLimit(prev => Math.min(prev + 5, 30))}
            disabled={limit >= 30}
          >
            More Data
          </Button>
        </div>
      </div>
      
      <SwarmVisualization metrics={recentMetrics || []} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate & Fanout Ratio Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAggregated ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">Loading metrics...</p>
              </div>
            ) : aggregatedChartData?.length === 0 ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={aggregatedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgSuccessRate" 
                    name="Success Rate (%)"
                    stroke="#8884d8" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgFanoutRatio" 
                    name="Fanout Ratio"
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Volume & Duration</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAggregated ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">Loading metrics...</p>
              </div>
            ) : aggregatedChartData?.length === 0 ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregatedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="tasks" 
                    name="Tasks"
                    fill="#8884d8" 
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="avgDuration" 
                    name="Avg Duration (ms)"
                    fill="#82ca9d" 
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SwarmMetricsTab;
