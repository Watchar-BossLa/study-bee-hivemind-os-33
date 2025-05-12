
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductivityHeatmapProps {
  data: Array<{
    date: string;
    hour: number;
    intensity: number;
  }>;
}

const ProductivityHeatmap = ({ data }: ProductivityHeatmapProps) => {
  // Generate days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate hours for the heatmap (6AM to 10PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  
  // Generate a matrix for the heatmap
  const getIntensityForHour = (day: number, hour: number) => {
    const entry = data.find(d => {
      const date = new Date(d.date);
      return date.getDay() === day && d.hour === hour;
    });
    return entry ? entry.intensity : 0;
  };

  // Map intensity to color class with higher contrast for accessibility
  const getColorClass = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity < 0.3) return 'bg-green-100 dark:bg-green-900';
    if (intensity < 0.6) return 'bg-green-300 dark:bg-green-700';
    return 'bg-green-500 dark:bg-green-500';
  };

  // Format the time for better readability
  const formatHour = (hour: number) => {
    return `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'am' : 'pm'}`;
  };

  // Get a percentage representation of intensity for screen readers
  const getIntensityPercentage = (intensity: number) => {
    return `${Math.round(intensity * 100)}%`;
  };

  // Generate a human-readable description for the tooltip
  const getTooltipContent = (day: string, hour: number, intensity: number) => {
    const intensityLevel = intensity === 0 ? 'No activity' : 
                          intensity < 0.3 ? 'Low activity' : 
                          intensity < 0.6 ? 'Medium activity' : 
                          'High activity';
    return `${day} at ${formatHour(hour)}: ${intensityLevel} (${getIntensityPercentage(intensity)})`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Study Focus Distribution</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">None</Badge>
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900">Low</Badge>
          <Badge variant="outline" className="bg-green-300 dark:bg-green-700">Medium</Badge>
          <Badge variant="outline" className="bg-green-500 dark:bg-green-500">High</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_1fr] gap-2" aria-label="Weekly study focus heatmap">
          <div></div>
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-xs font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="text-xs text-right pr-2">
                {formatHour(hour)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map((day, dayIndex) => {
                  const intensity = getIntensityForHour(dayIndex, hour);
                  return (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`h-4 rounded-sm ${getColorClass(intensity)}`}
                            aria-label={`${day} at ${formatHour(hour)}: ${getIntensityPercentage(intensity)} focus`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {getTooltipContent(day, hour, intensity)}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityHeatmap;
