
import React from 'react';

interface StudyTimeMetricProps {
  label: string;
  value: string | number;
  className?: string;
}

export const StudyTimeMetric: React.FC<StudyTimeMetricProps> = ({
  label,
  value,
  className = "bg-muted/50 p-3 rounded-lg text-center"
}) => {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};
