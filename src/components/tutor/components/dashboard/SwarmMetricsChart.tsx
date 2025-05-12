
import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { swarmMetricsService } from '../../services/metrics/SwarmMetricsService';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './swarm-metrics-columns';

interface SwarmMetricsChartProps {
  hoursBack?: number;
  limit?: number;
  className?: string;
}

interface MetricDataPoint {
  time: string;
  tasks: number;
  execTime: number;
  agents: number;
}

export function SwarmMetricsChart({ 
  hoursBack = 24, 
  limit = 50,
  className = ''
}: SwarmMetricsChartProps) {
  const data = useMemo(() => {
    const metrics = swarmMetricsService.getMetricsForVisualization(limit, hoursBack);
    
    // Transform the data into the format expected by recharts
    return metrics.times.map((time, i) => ({
      time,
      tasks: metrics.taskCounts[i],
      execTime: Math.round(metrics.executionTimes[i] / 10) / 100, // Convert to seconds with 2 decimal places
      agents: metrics.agentCounts[i]
    }));
  }, [hoursBack, limit]);
  
  const stats = useMemo(() => {
    return swarmMetricsService.getPerformanceStats(hoursBack);
  }, [hoursBack]);
  
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Swarm Metrics</CardTitle>
          <CardDescription>Agent swarm coordination activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/10">
            <p className="text-muted-foreground">No swarm activity data available in the last {hoursBack} hours</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle>Swarm Metrics</CardTitle>
        <CardDescription>Agent swarm coordination activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="execution">Execution Time</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={(value, index) => (index % 3 === 0 ? value : '')}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Agents', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="tasks" fill="#8884d8" name="Tasks" />
                  <Bar yAxisId="right" dataKey="agents" fill="#82ca9d" name="Agents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="execution" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={(value, index) => (index % 3 === 0 ? value : '')}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Execution Time (s)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="execTime"
                    stroke="#8884d8"
                    name="Execution Time (s)"
                    dot={{ r: 1 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-2xl font-bold">{stats.totalExecutions}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-sm font-medium">Avg Tasks/Swarm</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-2xl font-bold">{stats.averageTaskCount.toFixed(1)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-2xl font-bold">{(stats.averageExecutionTime / 1000).toFixed(2)}s</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-2xl font-bold">{stats.totalTokenUsage.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
