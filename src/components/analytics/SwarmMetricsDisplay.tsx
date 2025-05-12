
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";
import type { SwarmMetric } from '@/types/analytics';

interface SwarmMetricsDisplayProps {
  data: SwarmMetric[] | undefined;
}

const SwarmMetricsDisplay: React.FC<SwarmMetricsDisplayProps> = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Swarm Fan-out Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No swarm metrics data available</p>
        </CardContent>
      </Card>
    );
  }

  // Transform data for charts
  const chartData = data.map(item => ({
    name: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fanout: item.fanout_count,
    time: Math.round(item.completion_time_ms / 100) / 10, // Convert to seconds with 1 decimal
    success: Math.round(item.success_rate * 100),
    utilization: Math.round(item.agent_utilization * 100),
    taskType: item.task_type,
    priority: item.priority_level
  }));

  // Calculate averages for key metrics
  const avgFanout = data.reduce((sum, item) => sum + item.fanout_count, 0) / data.length;
  const avgCompletionTime = data.reduce((sum, item) => sum + item.completion_time_ms, 0) / data.length;
  const avgSuccessRate = data.reduce((sum, item) => sum + item.success_rate, 0) / data.length;
  const avgUtilization = data.reduce((sum, item) => sum + item.agent_utilization, 0) / data.length;

  // Group by task type
  const taskTypeCounts = data.reduce((acc, item) => {
    acc[item.task_type] = (acc[item.task_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskTypeData = Object.entries(taskTypeCounts).map(([type, count]) => ({
    name: type.replace(/_/g, ' '),
    count
  }));

  // Define chart configuration
  const fanoutChartConfig: ChartConfig = {
    fanout: {
      label: "Fan-out Count",
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      }
    }
  };

  const timeChartConfig: ChartConfig = {
    time: {
      label: "Completion Time (s)",
      theme: {
        light: "#10b981",
        dark: "#10b981"
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Swarm Fan-out Stats (24h)</CardTitle>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            QuorumForge MCP
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Avg Fan-out</span>
              <span className="text-2xl font-bold">{avgFanout.toFixed(1)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Avg Time</span>
              <span className="text-2xl font-bold">{(avgCompletionTime / 1000).toFixed(2)}s</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="text-2xl font-bold">{(avgSuccessRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Agent Utilization</span>
              <span className="text-2xl font-bold">{(avgUtilization * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ChartContainer config={fanoutChartConfig}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="fanout" fill="#3b82f6" name="Fan-out Count" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Completion Time (seconds)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ChartContainer config={timeChartConfig}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="time" stroke="#10b981" strokeWidth={2} name="Time (s)" />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskTypeData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SwarmMetricsDisplay;
