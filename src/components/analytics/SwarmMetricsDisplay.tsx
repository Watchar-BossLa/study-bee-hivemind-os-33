
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";
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
    priority: item.priority_level,
    // Include child task metrics
    childRatio: item.child_task_ratio ? Math.round(item.child_task_ratio * 100) : null,
    concurrency: item.task_concurrency || Math.round(item.fanout_count * item.agent_utilization)
  }));

  // Calculate averages for key metrics
  const avgFanout = data.reduce((sum, item) => sum + item.fanout_count, 0) / data.length;
  const avgCompletionTime = data.reduce((sum, item) => sum + item.completion_time_ms, 0) / data.length;
  const avgSuccessRate = data.reduce((sum, item) => sum + item.success_rate, 0) / data.length;
  const avgUtilization = data.reduce((sum, item) => sum + item.agent_utilization, 0) / data.length;
  const avgConcurrency = data.reduce((sum, item) => sum + (item.task_concurrency || item.fanout_count * item.agent_utilization), 0) / data.length;

  // Group by task type
  const taskTypeCounts = data.reduce((acc, item) => {
    acc[item.task_type] = (acc[item.task_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const taskTypeData = Object.entries(taskTypeCounts).map(([type, count]) => ({
    name: type.replace(/_/g, ' '),
    count
  }));

  // Group by priority level
  const priorityLevels = data.reduce((acc, item) => {
    acc[item.priority_level] = (acc[item.priority_level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityData = Object.entries(priorityLevels).map(([level, count]) => ({
    name: level,
    count
  }));

  // Calculate child task ratio average for display
  const avgChildRatio = data.reduce((sum, item) => sum + (item.child_task_ratio || 0), 0) / data.length;

  // Define chart configurations
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

  const successChartConfig: ChartConfig = {
    success: {
      label: "Success Rate (%)",
      theme: {
        light: "#f59e0b",
        dark: "#f59e0b"
      }
    }
  };

  const concurrencyChartConfig: ChartConfig = {
    concurrency: {
      label: "Task Concurrency",
      theme: {
        light: "#8b5cf6",
        dark: "#8b5cf6"
      }
    }
  };

  // Color mappings for priority levels
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'normal': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#8b5cf6';
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6" aria-label="Swarm metrics summary">
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
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Task Concurrency</span>
              <span className="text-2xl font-bold">{avgConcurrency.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="h-[300px]" aria-label="Fan-out count by date">
            <ChartContainer config={fanoutChartConfig}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
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
            <div className="h-[250px]" aria-label="Completion time by date">
              <ChartContainer config={timeChartConfig}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
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
            <div className="h-[250px]" aria-label="Task type distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]" aria-label="Success rate by date">
              <ChartContainer config={successChartConfig}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="success" stroke="#f59e0b" strokeWidth={2} name="Success Rate (%)" />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]" aria-label="Priority level distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Tasks">
                    {priorityData.map((entry, index) => (
                      <rect 
                        key={`rect-${index}`} 
                        fill={getPriorityColor(entry.name)} 
                        x={0} 
                        y={0} 
                        width={0} 
                        height={0} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New: Child Task Metrics Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Concurrency</CardTitle>
            <Badge variant="outline" className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
              feat/swarm-metrics
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]" aria-label="Task concurrency by date">
              <ChartContainer config={concurrencyChartConfig}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Area type="monotone" dataKey="concurrency" stroke="#8b5cf6" fill="#8b5cf680" name="Task Concurrency" />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Child Task Stats</CardTitle>
            <Badge variant="outline" className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
              feat/swarm-metrics
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Child task metrics show how effectively the Swarm distributes workloads across agents.
                Average child task ratio: <span className="font-semibold">{(avgChildRatio * 100).toFixed(1)}%</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4" aria-label="Child task stats summary">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">AutogenTurnGuard</p>
                <p className="text-lg font-semibold">max_turns: 6</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">LangChainQuotaGuard</p>
                <p className="text-lg font-semibold">rate_limit: active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SwarmMetricsDisplay;
