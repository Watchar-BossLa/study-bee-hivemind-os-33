
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { useFlashcardActivityHeatmap } from '@/hooks/flashcards';
import CalendarHeatmap from '../calendar/CalendarHeatmap';
import CalendarLegend from '../calendar/CalendarLegend';
import CalendarHeader from '../calendar/CalendarHeader';
import { Skeleton } from '@/components/ui/skeleton';

const FlashcardCalendarView = () => {
  const [timeframe, setTimeframe] = useState<number>(90); // Default to 90 days
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const { data: activityData, isLoading } = useFlashcardActivityHeatmap(timeframe);
  
  const handleTimeframeChange = (value: string) => {
    setTimeframe(parseInt(value));
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Study Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={timeframe.toString()} 
          onValueChange={handleTimeframeChange} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="30">30 Days</TabsTrigger>
            <TabsTrigger value="90">90 Days</TabsTrigger>
            <TabsTrigger value="180">6 Months</TabsTrigger>
            <TabsTrigger value="365">1 Year</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <div>
            <CalendarHeader 
              currentMonth={currentMonth} 
              onMonthChange={setCurrentMonth} 
            />
            <CalendarHeatmap 
              data={activityData || []} 
              month={currentMonth} 
            />
            <CalendarLegend />
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">
                Total days with activity: {activityData?.filter(day => day.count > 0).length || 0}
              </p>
              <p>
                Average accuracy: {
                  activityData && activityData.length > 0 
                    ? Math.round(activityData.reduce((sum, day) => sum + (day.count > 0 ? day.accuracy : 0), 0) / 
                       (activityData.filter(day => day.count > 0).length || 1))
                    : 0
                }%
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardCalendarView;
