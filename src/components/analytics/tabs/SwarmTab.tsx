
import React from 'react';
import SwarmMetricsDisplay from '../SwarmMetricsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { SwarmMetric } from '@/types/analytics';

interface SwarmTabProps {
  swarmMetrics: SwarmMetric[] | undefined;
}

const SwarmTab: React.FC<SwarmTabProps> = ({ swarmMetrics }) => {
  return (
    <div className="space-y-6">
      <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription>
          QuorumForge Swarm metrics show task distribution and agent coordination activity as specified in TSB section 16.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>About Swarm Metrics</CardTitle>
          <CardDescription>
            Swarm Fan-out statistics demonstrate the parallel execution capabilities of QuorumForge's agent architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The Swarm metrics dashboard visualizes the distributed task execution patterns across QuorumForge councils.
            Fan-out refers to the number of parallel tasks executed per request, while success rate tracks completion quality.
            As mentioned in TSB section 6, agent utilization reflects the efficiency of resource allocation.
          </p>
        </CardContent>
      </Card>

      <SwarmMetricsDisplay data={swarmMetrics} />
    </div>
  );
};

export default SwarmTab;
