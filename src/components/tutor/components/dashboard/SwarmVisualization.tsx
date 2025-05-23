
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SwarmMetricsRecord } from '@/components/tutor/services/metrics/SwarmMetricsService';

interface SwarmVisualizationProps {
  metrics: SwarmMetricsRecord[];
}

export const SwarmVisualization: React.FC<SwarmVisualizationProps> = ({ metrics }) => {
  const chartData = metrics.map((metric) => ({
    timestamp: new Date(metric.timestamp).toLocaleTimeString(),
    successRate: Math.round(metric.successRate * 100),
    fanoutRatio: Number(metric.fanoutRatio.toFixed(1)),
    avgDuration: Math.round(metric.durationMs),
    taskCount: metric.taskCount,
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swarm Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {metrics.length === 0 ? (
          <div className="h-60 flex items-center justify-center">
            <p className="text-muted-foreground">No swarm execution data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="taskCount"
                stroke="#8884d8"
                name="Task Count"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgDuration"
                stroke="#82ca9d"
                name="Avg Duration (ms)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="successRate"
                stroke="#ff8042"
                name="Success Rate (%)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="fanoutRatio"
                stroke="#0088fe"
                name="Fanout Ratio"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
