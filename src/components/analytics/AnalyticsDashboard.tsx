
import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { 
  Tabs, 
  TabsContent,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Import our new components
import AnalyticsTabs from './AnalyticsTabs';
import OverviewTab from './tabs/OverviewTab';
import ProgressTab from './tabs/ProgressTab';
import RecommendationsTab from './tabs/RecommendationsTab';
import ProductivityTab from './tabs/ProductivityTab';

const AnalyticsDashboard = () => {
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
        <AnalyticsTabs />
        
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
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
