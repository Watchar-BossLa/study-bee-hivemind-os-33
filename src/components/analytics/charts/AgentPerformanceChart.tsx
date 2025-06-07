
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AgentMetrics } from '@/services/analytics/QuorumForgeAnalyticsService';

interface AgentPerformanceChartProps {
  data: AgentMetrics[];
  metric: 'responseTime' | 'accuracyScore' | 'consensusParticipation' | 'tasksCompleted';
}

export const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({ data, metric }) => {
  const formatValue = (value: number) => {
    switch (metric) {
      case 'responseTime':
        return `${Math.round(value)}ms`;
      case 'accuracyScore':
      case 'consensusParticipation':
        return `${Math.round(value * 100)}%`;
      case 'tasksCompleted':
        return value.toString();
      default:
        return value.toString();
    }
  };

  const getColor = () => {
    switch (metric) {
      case 'responseTime':
        return '#ef4444'; // Red for response time (lower is better)
      case 'accuracyScore':
        return '#22c55e'; // Green for accuracy
      case 'consensusParticipation':
        return '#3b82f6'; // Blue for participation
      case 'tasksCompleted':
        return '#8b5cf6'; // Purple for tasks
      default:
        return '#6b7280';
    }
  };

  const chartData = data.map(agent => ({
    name: agent.agentName.replace('Agent', ''),
    value: agent[metric],
    fullName: agent.agentName
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [formatValue(value), 'Value']}
            labelFormatter={(label) => `Agent: ${label}`}
          />
          <Bar dataKey="value" fill={getColor()} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
