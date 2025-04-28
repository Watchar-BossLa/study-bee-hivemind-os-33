
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Habits Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="minutes" fill="#3b82f6" name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHabitsChart;
