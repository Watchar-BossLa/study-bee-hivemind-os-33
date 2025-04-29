
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FocusInterval } from '@/types/analytics';

interface ProductivityHeatmapProps {
  data: FocusInterval[];
}

const ProductivityHeatmap: React.FC<ProductivityHeatmapProps> = ({ data }) => {
  const hours = Array.from(new Set(data.map(interval => interval.hour))).sort((a, b) => a - b);
  const dates = Array.from(new Set(data.map(interval => interval.date))).sort();

  const getProductivityScore = (date: string, hour: number): number | null => {
    const interval = data.find(d => d.date === date && d.hour === hour);
    return interval ? interval.productivity_score : null;
  };

  const getColorForScore = (score: number | null): string => {
    if (score === null) return 'bg-gray-100';
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-400';
    if (score >= 60) return 'bg-yellow-300';
    if (score >= 50) return 'bg-orange-300';
    return 'bg-red-300';
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    return hour < 12 ? `${hour}am` : `${hour-12}pm`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-[auto_repeat(auto-fill,minmax(45px,1fr))]">
              {/* Top row - dates */}
              <div className="h-10" /> {/* Empty cell for top-left corner */}
              {dates.map(date => (
                <div key={date} className="h-10 flex items-center justify-center text-xs">
                  {formatDate(date)}
                </div>
              ))}
              
              {/* Hour rows */}
              {hours.map(hour => (
                <React.Fragment key={hour}>
                  <div className="flex items-center justify-end pr-2 h-10 text-xs text-muted-foreground">
                    {formatHour(hour)}
                  </div>
                  {dates.map(date => {
                    const score = getProductivityScore(date, hour);
                    return (
                      <div key={`${date}-${hour}`} className="p-1">
                        <div
                          className={`w-full h-8 rounded-sm ${getColorForScore(score)} flex items-center justify-center text-xs font-medium text-white`}
                          title={score !== null ? `${formatDate(date)} at ${formatHour(hour)}: ${score}% productivity` : 'No data'}
                        >
                          {score !== null ? score : ''}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-4 gap-2 text-xs">
          <span>Productivity: </span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-300 rounded-sm" /> <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-300 rounded-sm" /> <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-400 rounded-sm" /> <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded-sm" /> <span>Excellent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityHeatmap;
