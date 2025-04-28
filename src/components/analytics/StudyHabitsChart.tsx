
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface StudyHabitsChartProps {
  data: Array<{
    date: string;
    total_study_time_minutes: number;
    sessions_completed: number;
  }>;
}

const StudyHabitsChart = ({ data }: StudyHabitsChartProps) => {
  const chartData = data?.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    minutes: item.total_study_time_minutes,
    sessions: item.sessions_completed,
  })) || [];

  // Define chart configuration with color theme
  const chartConfig: ChartConfig = {
    minutes: {
      label: "Study Minutes",
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Habits Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="minutes" fill="#3b82f6" name="Minutes" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHabitsChart;
