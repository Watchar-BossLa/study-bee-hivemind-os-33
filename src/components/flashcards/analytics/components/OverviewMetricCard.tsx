
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface OverviewMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  total?: number;
  unit?: string;
  secondaryValue?: string;
}

export const OverviewMetricCard: React.FC<OverviewMetricCardProps> = ({
  title,
  value,
  icon,
  description,
  total,
  unit,
  secondaryValue
}) => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
        </div>
        
        {total && (
          <div className="mt-2">
            <Progress 
              value={total > 0 ? (Number(value) / total) * 100 : 0} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {value} of {total} cards
            </p>
          </div>
        )}
        
        {secondaryValue && (
          <p className="text-xs text-muted-foreground mt-1">
            {secondaryValue}
          </p>
        )}
        
        {!total && !secondaryValue && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
