
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  name: string;
  avgSuccessRate: number;
  avgFanoutRatio: number;
  avgDuration: number;
  tasks: number;
}

interface SwarmMetricsChartsProps {
  chartData: ChartDataPoint[];
  isLoading: boolean;
}

const SwarmMetricsCharts: React.FC<SwarmMetricsChartsProps> = ({ chartData, isLoading }) => {
  const renderLoadingState = () => (
    <div className="h-60 flex items-center justify-center">
      <p className="text-muted-foreground">Loading metrics...</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="h-60 flex items-center justify-center">
      <p className="text-muted-foreground">No data available</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Success Rate & Fanout Ratio Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? renderLoadingState() : chartData?.length === 0 ? renderEmptyState() : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
          {isLoading ? renderLoadingState() : chartData?.length === 0 ? renderEmptyState() : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
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
  );
};

export default SwarmMetricsCharts;
