
import React from 'react';
import { useAnalyticsPageData } from '@/hooks/useAnalyticsPageData';
import { 
  Tabs, 
  TabsContent,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCcw } from "lucide-react";

// Import our analytics components
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
    isLoading,
    timeframe,
    setTimeframe,
    isExporting,
    handleExportData,
    isRefreshing,
    refreshData
  } = useAnalyticsPageData();

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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={refreshData} 
            disabled={isRefreshing}
            aria-label="Refresh data"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Button 
          onClick={handleExportData} 
          disabled={isExporting}
          className="w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </div>

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
