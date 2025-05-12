
import React from 'react';
import SwarmMetricsDisplay from '../SwarmMetricsDisplay';
import type { SwarmMetric } from '@/types/analytics';

interface SwarmTabProps {
  swarmMetrics: SwarmMetric[] | undefined;
}

const SwarmTab: React.FC<SwarmTabProps> = ({ swarmMetrics }) => {
  return (
    <div className="space-y-6">
      <SwarmMetricsDisplay data={swarmMetrics} />
    </div>
  );
};

export default SwarmTab;
