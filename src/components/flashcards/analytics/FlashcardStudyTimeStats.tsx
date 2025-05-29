
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlashcardStudyTime } from '@/hooks/flashcards/useFlashcardAnalytics';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Clock } from 'lucide-react';
import { StudyTimeMetric } from './components/StudyTimeMetric';

const formatTime = (ms: number): string => {
  if (ms === 0) return '0m';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const FlashcardStudyTimeStats = () => {
  const [timeframe, setTimeframe] = React.useState<'today' | 'week' | 'month' | 'all'>('today');
  
  const { data, isLoading } = useFlashcardStudyTime(timeframe);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Study Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Study Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-2 gap-4">
            <StudyTimeMetric 
              label="Total time"
              value={formatTime(data?.totalTimeMs || 0)}
            />
            <StudyTimeMetric 
              label="Sessions"
              value={data?.sessions || 0}
            />
            <StudyTimeMetric 
              label="Cards reviewed"
              value={data?.uniqueCards || 0}
            />
            <StudyTimeMetric 
              label="Avg. per card"
              value={formatTime(data?.averageTimePerCardMs || 0)}
            />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
