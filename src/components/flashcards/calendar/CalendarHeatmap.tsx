
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, parseISO, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns';

interface CalendarHeatmapProps {
  data: {
    date: string;
    count: number;
    correct: number;
    accuracy: number;
  }[];
  month: Date;
}

const getIntensityClass = (count: number): string => {
  if (count === 0) return "bg-muted/40";
  if (count < 5) return "bg-green-100 dark:bg-green-900/30";
  if (count < 10) return "bg-green-200 dark:bg-green-800/40";
  if (count < 20) return "bg-green-300 dark:bg-green-700/50";
  if (count < 30) return "bg-green-400 dark:bg-green-600/60";
  return "bg-green-500 dark:bg-green-500/70";
};

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data, month }) => {
  // Generate all days in the current month
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month)
  });

  // Calculate the start day of the month (0 = Sunday, 1 = Monday, ...)
  const startDay = startOfMonth(month).getDay();
  
  // Create a grid of days including empty slots for proper alignment
  const calendarGrid = Array(startDay).fill(null).concat(days);
  
  return (
    <div className="grid grid-cols-7 gap-1 mt-4">
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-xs text-center font-medium text-muted-foreground">
          {day}
        </div>
      ))}
      
      {/* Calendar cells */}
      {calendarGrid.map((day, index) => {
        if (!day) {
          // Empty cell for alignment
          return <div key={`empty-${index}`} className="h-10" />;
        }

        // Find activity for this day
        const dayStr = format(day, 'yyyy-MM-dd');
        const activityData = data.find(item => item.date === dayStr);
        const count = activityData?.count || 0;
        const accuracy = activityData?.accuracy || 0;
        
        return (
          <TooltipProvider key={dayStr}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`h-10 flex items-center justify-center rounded-md border ${getIntensityClass(count)} transition-colors hover:border-primary/40`}
                >
                  <span className={`text-xs ${count > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-xs">
                  <p className="font-medium">{format(day, 'MMMM d, yyyy')}</p>
                  <p>Cards reviewed: {count}</p>
                  {count > 0 && (
                    <p>Accuracy: {Math.round(accuracy)}%</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default CalendarHeatmap;
