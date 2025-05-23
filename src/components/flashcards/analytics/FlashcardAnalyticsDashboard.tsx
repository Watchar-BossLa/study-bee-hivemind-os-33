
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ChartBar, Clock, Calendar } from 'lucide-react';
import FlashcardAnalyticsOverview from './FlashcardAnalyticsOverview';
import FlashcardReviewHistory from './FlashcardReviewHistory';
import { FlashcardStudyTimeStats } from './FlashcardStudyTimeStats';
import FlashcardCalendarView from './FlashcardCalendarView';

const FlashcardAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Review History</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Study Calendar</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <FlashcardAnalyticsOverview />
          <div className="grid md:grid-cols-2 gap-6">
            <FlashcardStudyTimeStats />
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6 mt-6">
          <FlashcardReviewHistory />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-6 mt-6">
          <FlashcardCalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlashcardAnalyticsDashboard;
