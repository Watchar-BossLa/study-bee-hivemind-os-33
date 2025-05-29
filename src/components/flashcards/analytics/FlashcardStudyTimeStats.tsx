
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlashcardStudyTime } from '@/hooks/flashcards/useFlashcardStudyTime';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Clock } from 'lucide-react';

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
        <Tabs value={timeframe} onValueChange={(v: string) => setTimeframe(v as any)} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Total time</p>
              <p className="text-2xl font-bold">{formatTime(data?.totalTimeMs || 0)}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Sessions</p>
              <p className="text-2xl font-bold">{data?.sessions || 0}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Cards reviewed</p>
              <p className="text-2xl font-bold">{data?.uniqueCards || 0}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Avg. per card</p>
              <p className="text-2xl font-bold">
                {formatTime(data?.averageTimePerCardMs || 0)}
              </p>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
