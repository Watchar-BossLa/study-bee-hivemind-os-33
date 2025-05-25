
import React from 'react';
import AgentCard from './AgentCard';
import { AgentPerformanceMetrics } from '@/components/tutor/services/metrics/SwarmMetricsService';

interface AgentPerformanceGridProps {
  agentMetrics: AgentPerformanceMetrics[];
  getSuccessRate: (agent: AgentPerformanceMetrics) => number;
  getActivityStatus: (lastActive: Date) => { status: string; color: string };
  getInitials: (name: string) => string;
}

const AgentPerformanceGrid: React.FC<AgentPerformanceGridProps> = ({
  agentMetrics,
  getSuccessRate,
  getActivityStatus,
  getInitials
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {agentMetrics.map((agent) => (
        <AgentCard
          key={agent.agentId}
          agent={agent}
          getSuccessRate={getSuccessRate}
          getActivityStatus={getActivityStatus}
          getInitials={getInitials}
        />
      ))}
    </div>
  );
};

export default AgentPerformanceGrid;
