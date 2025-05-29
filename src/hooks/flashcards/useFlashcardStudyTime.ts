
import { useMemo } from 'react';
import { useRecentFlashcardReviews } from './useRecentFlashcardReviews';

export interface StudyTimeData {
  totalStudyTimeMs: number;
  averageSessionLength: number;
  studySessionsCount: number;
  dailyStudyTime: Record<string, number>;
  weeklyStudyTime: Record<string, number>;
  longestSession: number;
  shortestSession: number;
  studyEfficiency: number; // correct answers per minute
}

export function useFlashcardStudyTime(days: number = 30) {
  const { data: reviews, isLoading } = useRecentFlashcardReviews(1000);

  const studyTimeData = useMemo((): StudyTimeData | null => {
    if (!reviews || reviews.length === 0) return null;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const relevantReviews = reviews.filter(
      r => new Date(r.review_time) >= cutoffDate && r.response_time_ms !== null
    );

    if (relevantReviews.length === 0) return null;

    // Calculate total study time
    const totalStudyTimeMs = relevantReviews.reduce(
      (sum, review) => sum + (review.response_time_ms || 0), 0
    );

    // Group by sessions (reviews within 30 minutes of each other)
    const sessions: number[][] = [];
    let currentSession: number[] = [];
    
    relevantReviews.forEach((review, index) => {
      if (index === 0) {
        currentSession = [review.response_time_ms || 0];
      } else {
        const timeDiff = new Date(review.review_time).getTime() - 
                        new Date(relevantReviews[index - 1].review_time).getTime();
        
        if (timeDiff <= 30 * 60 * 1000) { // 30 minutes
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

    // Calculate session statistics
    const sessionLengths = sessions.map(session => 
      session.reduce((sum, time) => sum + time, 0)
    );

    const averageSessionLength = sessionLengths.length > 0
      ? sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length
      : 0;

    const longestSession = sessionLengths.length > 0 ? Math.max(...sessionLengths) : 0;
    const shortestSession = sessionLengths.length > 0 ? Math.min(...sessionLengths) : 0;

    // Calculate daily study time
    const dailyStudyTime: Record<string, number> = {};
    relevantReviews.forEach(review => {
      const date = new Date(review.review_time).toISOString().split('T')[0];
      dailyStudyTime[date] = (dailyStudyTime[date] || 0) + (review.response_time_ms || 0);
    });

    // Calculate weekly study time
    const weeklyStudyTime: Record<string, number> = {};
    relevantReviews.forEach(review => {
      const date = new Date(review.review_time);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      weeklyStudyTime[weekKey] = (weeklyStudyTime[weekKey] || 0) + (review.response_time_ms || 0);
    });

    // Calculate study efficiency (correct answers per minute)
    const correctAnswers = relevantReviews.filter(r => r.was_correct).length;
    const totalMinutes = totalStudyTimeMs / (1000 * 60);
    const studyEfficiency = totalMinutes > 0 ? correctAnswers / totalMinutes : 0;

    return {
      totalStudyTimeMs,
      averageSessionLength,
      studySessionsCount: sessions.length,
      dailyStudyTime,
      weeklyStudyTime,
      longestSession,
      shortestSession,
      studyEfficiency,
    };
  }, [reviews, days]);

  return {
    data: studyTimeData,
    isLoading,
  };
}
