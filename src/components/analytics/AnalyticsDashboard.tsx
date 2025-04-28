
import React from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import StudyHabitsChart from './StudyHabitsChart';
import PerformanceChart from './PerformanceChart';
import { Skeleton } from "@/components/ui/skeleton";

const AnalyticsDashboard = () => {
  const { studyMetrics, performanceRecords, isLoading } = useAnalytics();

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
      <StudyHabitsChart data={studyMetrics || []} />
      <PerformanceChart data={performanceRecords || []} />
    </div>
  );
};

export default AnalyticsDashboard;
