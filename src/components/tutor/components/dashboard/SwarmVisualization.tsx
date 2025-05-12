
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { swarmMetricsService, SwarmMetricsRecord } from '../../services/metrics/SwarmMetricsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SwarmVisualizationProps {
  metrics?: SwarmMetricsRecord[];
  isLoading?: boolean;
  className?: string;
}

/**
 * Visualization component for Swarm execution metrics
 * Implements the 'feat/swarm-metrics' visualization feature
 */
export const SwarmVisualization = ({ metrics, isLoading = false, className = '' }: SwarmVisualizationProps) => {
  const visualizationMetrics = metrics || swarmMetricsService.getMetricsRecords();
  
  // Format data for chart
  const chartData = visualizationMetrics.map((record) => ({
    time: new Date(record.timestamp).toLocaleTimeString(),
    taskCount: record.taskCount,
    durationSec: Math.round(record.durationMs / 100) / 10,
    successRate: Math.round(record.successRate * 100),
    fanoutRatio: Math.round(record.fanoutRatio * 100) / 100
  })).slice(0, 8).reverse(); // Last 8 executions, chronological order
  
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Swarm Fan-out Stats (Last 24h)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : visualizationMetrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground">
            <p>No swarm executions recorded yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="taskCount" name="Task Count" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="fanoutRatio" name="Fan-out Ratio" fill="#82ca9d" />
              <Bar yAxisId="right" dataKey="successRate" name="Success Rate %" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {visualizationMetrics.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="font-semibold">Total Tasks Processed</p>
              <p>{visualizationMetrics.reduce((sum, record) => sum + record.taskCount, 0)}</p>
            </div>
            <div>
              <p className="font-semibold">Average Success Rate</p>
              <p>{Math.round(visualizationMetrics.reduce((sum, record) => sum + record.successRate, 0) / visualizationMetrics.length * 100)}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
