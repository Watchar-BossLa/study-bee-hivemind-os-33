
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  isPercentage?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isPercentage = true 
}) => {
  const displayValue = isPercentage ? Math.round(value * 100) : Math.round(value);
  const progressValue = isPercentage ? value * 100 : value;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color.replace('text-', 'text-').replace('500', '600')}`}>
          {displayValue}{isPercentage ? '%' : ''}
        </div>
        <Progress value={progressValue} className="h-2 mt-2" />
      </CardContent>
    </Card>
  );
};

export default MetricCard;
