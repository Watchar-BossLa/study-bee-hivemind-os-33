
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import type { LearningPathMetrics } from '@/services/analytics/QuorumForgeAnalyticsService';

interface LearningPathChartProps {
  data: LearningPathMetrics[];
}

export const LearningPathChart: React.FC<LearningPathChartProps> = ({ data }) => {
  const chartData = data.map(path => ({
    path: path.pathId.replace('path-', 'Path '),
    completion: Math.round(path.completionRate * 100),
    engagement: Math.round(path.engagementLevel * 100),
    score: Math.round(path.averageScore)
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="path" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 10 }}
            angle={90}
          />
          <Radar 
            name="Completion Rate" 
            dataKey="completion" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar 
            name="Engagement Level" 
            dataKey="engagement" 
            stroke="#22c55e" 
            fill="#22c55e" 
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Radar 
            name="Average Score" 
            dataKey="score" 
            stroke="#f59e0b" 
            fill="#f59e0b" 
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
