
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ConsensusMetrics } from '@/services/analytics/QuorumForgeAnalyticsService';

interface ConsensusPatternChartProps {
  data: ConsensusMetrics[];
}

export const ConsensusPatternChart: React.FC<ConsensusPatternChartProps> = ({ data }) => {
  const chartData = data
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((session, index) => ({
      session: `S${index + 1}`,
      convergenceTime: Math.round(session.convergenceTime / 1000), // Convert to seconds
      confidence: Math.round(session.finalConfidence * 100),
      participants: session.participantCount,
      success: session.consensusReached ? 1 : 0
    }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="session" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number, name: string) => {
              switch (name) {
                case 'convergenceTime':
                  return [`${value}s`, 'Convergence Time'];
                case 'confidence':
                  return [`${value}%`, 'Final Confidence'];
                case 'participants':
                  return [value, 'Participants'];
                default:
                  return [value, name];
              }
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="convergenceTime" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Convergence Time (s)"
          />
          <Line 
            type="monotone" 
            dataKey="confidence" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Confidence %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
