
import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import StudyHabitsChart from './StudyHabitsChart';
import PerformanceChart from './PerformanceChart';
import StudyRecommendations from './StudyRecommendations';
import ProductivityHeatmap from './ProductivityHeatmap';
import SubjectProgressCards from './SubjectProgressCards';
import WeakAreasTable from './WeakAreasTable';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ChartBar, BookOpen, Brain, Clock } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

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
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="productivity" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Productivity</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <StudyHabitsChart data={studyMetrics || []} />
            <PerformanceChart data={performanceRecords || []} />
          </div>
          <SubjectProgressCards data={subjectProgress || []} />
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6 mt-6">
          <SubjectProgressCards data={subjectProgress || []} />
          <PerformanceChart data={performanceRecords || []} />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-6 mt-6">
          <StudyRecommendations recommendations={studyRecommendations || []} />
          <WeakAreasTable data={weakAreaRecommendations || []} />
        </TabsContent>
        
        <TabsContent value="productivity" className="space-y-6 mt-6">
          <ProductivityHeatmap data={focusIntervals || []} />
          <StudyHabitsChart data={studyMetrics || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
