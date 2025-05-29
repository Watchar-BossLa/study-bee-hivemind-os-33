
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { FlashcardService } from '@/services/FlashcardService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { ANALYTICS_CONSTANTS } from '@/config/constants';

export function useFlashcardAnalyticsSummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['flashcard-analytics-summary', user?.id],
    queryFn: () => AnalyticsService.getSummaryData(user!.id),
    enabled: !!user?.id,
    staleTime: 60000,
  });
}

export function useRecentFlashcardReviews(limit: number = 100) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-flashcard-reviews', user?.id, limit],
    queryFn: () => FlashcardService.getRecentReviews(user!.id, limit),
    enabled: !!user?.id,
    staleTime: 60000,
  });
}

export function useFlashcardStatistics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['flashcard-statistics', user?.id],
    queryFn: () => FlashcardService.getStatistics(user!.id),
    enabled: !!user?.id,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useFlashcardActivityHeatmap(days: number = ANALYTICS_CONSTANTS.HEATMAP_DEFAULT_DAYS) {
  const { user } = useAuth();

  const { data: rawData, isLoading } = useQuery({
    queryKey: ['flashcard-activity-heatmap', user?.id, days],
    queryFn: () => FlashcardService.getActivityHeatmap(user!.id, days),
    enabled: !!user?.id,
    staleTime: 300000,
  });

  const heatmapData = useMemo(() => {
    if (!rawData) return [];
    return AnalyticsService.calculateHeatmapData(rawData, days);
  }, [rawData, days]);

  return {
    data: heatmapData,
    isLoading,
  };
}

export function useFlashcardStudyTime(timeframe: 'today' | 'week' | 'month' | 'all' = 'today') {
  const days = timeframe === 'today' ? 1 : timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 365;
  const { data: reviews, isLoading } = useRecentFlashcardReviews(1000);

  const data = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const relevantReviews = reviews.filter(
      r => new Date(r.review_time) >= cutoffDate && r.response_time_ms !== null
    );

    if (relevantReviews.length === 0) return null;

    const totalTimeMs = relevantReviews.reduce(
      (sum, review) => sum + (review.response_time_ms || 0), 0
    );

    const uniqueCards = new Set(relevantReviews.map(r => r.flashcard_id)).size;
    const averageTimePerCardMs = uniqueCards > 0 ? totalTimeMs / uniqueCards : 0;

    // Group by sessions (reviews within 30 minutes of each other)
    const sessions: number[][] = [];
    let currentSession: number[] = [];
    
    relevantReviews.forEach((review, index) => {
      if (index === 0) {
        currentSession = [review.response_time_ms || 0];
      } else {
        const timeDiff = new Date(review.review_time).getTime() - 
                        new Date(relevantReviews[index - 1].review_time).getTime();
        
        if (timeDiff <= ANALYTICS_CONSTANTS.STUDY_TIME_SESSION_GAP_MS) {
          currentSession.push(review.response_time_ms || 0);
        } else {
          sessions.push(currentSession);
          currentSession = [review.response_time_ms || 0];
        }
      }
    });
    
    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }

    const sessionLengths = sessions.map(session => 
      session.reduce((sum, time) => sum + time, 0)
    );

    return {
      totalTimeMs,
      sessions: sessions.length,
      uniqueCards,
      averageTimePerCardMs,
      totalStudyTimeMs: totalTimeMs,
      averageSessionLength: sessionLengths.length > 0 
        ? sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length 
        : 0,
      studySessionsCount: sessions.length,
      dailyStudyTime: {},
      weeklyStudyTime: {},
      longestSession: sessionLengths.length > 0 ? Math.max(...sessionLengths) : 0,
      shortestSession: sessionLengths.length > 0 ? Math.min(...sessionLengths) : 0,
      studyEfficiency: 0,
    };
  }, [reviews, days]);

  return {
    data,
    isLoading,
  };
}
