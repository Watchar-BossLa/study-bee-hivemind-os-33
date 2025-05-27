
import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Tabs, 
  TabsContent,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Import components
import AnalyticsTabsEnhanced from './AnalyticsTabsEnhanced';
import OverviewTab from './tabs/OverviewTab';
import ProgressTab from './tabs/ProgressTab';
import RecommendationsTab from './tabs/RecommendationsTab';
import ProductivityTab from './tabs/ProductivityTab';
import SpacedRepetitionAnalytics from './SpacedRepetitionAnalytics';

const AnalyticsDashboardEnhanced = () => {
  const { 
    studyMetrics, 
    performanceRecords, 
    studyRecommendations, 
    focusIntervals,
    subjectProgress,
    weakAreaRecommendations,
    isLoading 
  } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <AnalyticsTabsEnhanced />
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <OverviewTab 
            studyMetrics={studyMetrics}
            performanceRecords={performanceRecords}
            subjectProgress={subjectProgress}
          />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6 mt-6">
          <ProgressTab 
            performanceRecords={performanceRecords}
            subjectProgress={subjectProgress}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <RecommendationsTab 
            studyRecommendations={studyRecommendations}
            weakAreaRecommendations={weakAreaRecommendations}
          />
        </TabsContent>
        
        <TabsContent value="productivity" className="space-y-6 mt-6">
          <ProductivityTab 
            focusIntervals={focusIntervals}
            studyMetrics={studyMetrics}
          />
        </TabsContent>

        <TabsContent value="spaced-repetition" className="space-y-6 mt-6">
          <SpacedRepetitionAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboardEnhanced;
