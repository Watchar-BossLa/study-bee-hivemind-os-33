
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface PerformanceChartProps {
  data: Array<{
    completed_at: string;
    score: number;
    subject_id: string;
  }>;
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const chartData = data?.map(item => ({
    name: new Date(item.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score,
    subject: item.subject_id,
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" name="Score" />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
