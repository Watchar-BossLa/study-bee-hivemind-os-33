
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface SwarmMetricsControlsProps {
  period: 'hour' | 'day' | 'week';
  onPeriodChange: (period: 'hour' | 'day' | 'week') => void;
  limit: number;
  onLoadMore: () => void;
}

const SwarmMetricsControls: React.FC<SwarmMetricsControlsProps> = ({
  period,
  onPeriodChange,
  limit,
  onLoadMore
}) => {
  return (
    <div className="flex items-center gap-4">
      <Tabs defaultValue={period} onValueChange={(value) => onPeriodChange(value as any)}>
        <TabsList>
          <TabsTrigger value="hour">Hourly</TabsTrigger>
          <TabsTrigger value="day">Daily</TabsTrigger>
          <TabsTrigger value="week">Weekly</TabsTrigger>
        </TabsList>
      </Tabs>
      <Button 
        variant="outline" 
        onClick={onLoadMore}
        disabled={limit >= 30}
      >
        More Data
      </Button>
    </div>
  );
};

export default SwarmMetricsControls;
