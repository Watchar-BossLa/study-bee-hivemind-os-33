
import { useStudyMetrics } from './analytics/useStudyMetrics';
import { usePerformanceRecords } from './analytics/usePerformanceRecords';
import { useStudyRecommendations } from './analytics/useStudyRecommendations';
import { useFocusIntervals } from './analytics/useFocusIntervals';
import { useSubjectProgress } from './analytics/useSubjectProgress';
import { useWeakAreaRecommendations } from './analytics/useWeakAreaRecommendations';

export function useAnalytics() {
  const { data: studyMetrics, isLoading: isLoadingMetrics } = useStudyMetrics();
  const { data: performanceRecords, isLoading: isLoadingPerformance } = usePerformanceRecords();
  const { data: studyRecommendations, isLoading: isLoadingRecommendations } = useStudyRecommendations();
  const { data: focusIntervals, isLoading: isLoadingFocusIntervals } = useFocusIntervals();
  const { data: subjectProgress, isLoading: isLoadingSubjectProgress } = useSubjectProgress();
  const { data: weakAreaRecommendations, isLoading: isLoadingWeakAreas } = useWeakAreaRecommendations();

  return {
    studyMetrics,
    performanceRecords,
    studyRecommendations,
    focusIntervals,
    subjectProgress,
    weakAreaRecommendations,
    isLoading: isLoadingMetrics || 
               isLoadingPerformance || 
               isLoadingRecommendations || 
               isLoadingFocusIntervals || 
               isLoadingSubjectProgress ||
               isLoadingWeakAreas,
  };
}
