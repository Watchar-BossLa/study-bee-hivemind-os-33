
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SwarmMetricsHeaderProps {
  metricsCount: number;
}

const SwarmMetricsHeader: React.FC<SwarmMetricsHeaderProps> = ({ metricsCount }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Swarm Metrics Dashboard</h2>
      <Badge variant="outline" className="text-sm">
        {metricsCount} Recent Metrics
      </Badge>
    </div>
  );
};

export default SwarmMetricsHeader;
