
import { useMemo } from 'react';
import { useFlashcardStatistics } from './useFlashcardStatistics';
import { useRecentFlashcardReviews } from './useRecentFlashcardReviews';

export interface AnalyticsSummary {
  totalCards: number;
  cardsDue: number;
  cardsLearned: number;
  cardsMastered: number;
  retentionRate: number;
  streakDays: number;
  averageResponseTime: number;
  predictedSuccessRate: number;
  learningVelocity: number;
  dailyGoalProgress: number;
  weeklyReviewCount: number;
  subjectDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  memoryStrengthAverage: number;
  // Add missing properties that components expect
  retention_rate: number;
  cards_mastered: number;
  streak_days: number;
  total_cards: number;
  last_study_date: string | null;
  reviewsToday: number;
  correctReviewsToday: number;
}

export function useFlashcardAnalyticsSummary() {
  const { data: statistics, isLoading: statsLoading } = useFlashcardStatistics();
  const { data: reviews, isLoading: reviewsLoading } = useRecentFlashcardReviews(500);

  const data = useMemo((): AnalyticsSummary | null => {
    if (!statistics || !reviews) return null;

    // Calculate average response time
    const validResponseTimes = reviews
      .filter(r => r.response_time_ms !== null)
      .map(r => r.response_time_ms!);
    
    const averageResponseTime = validResponseTimes.length > 0
      ? validResponseTimes.reduce((sum, time) => sum + time, 0) / validResponseTimes.length
      : 3000;

    // Calculate weekly review count
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyReviewCount = reviews.filter(
      r => new Date(r.review_time) >= oneWeekAgo
    ).length;

    // Calculate today's reviews
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReviews = reviews.filter(r => {
      const reviewDate = new Date(r.review_time);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate.getTime() === today.getTime();
    });
    
    const reviewsToday = todayReviews.length;
    const correctReviewsToday = todayReviews.filter(r => r.was_correct).length;

    // Calculate subject distribution
    const subjectDistribution: Record<string, number> = {};
    reviews.forEach(review => {
      const subject = review.flashcard?.subject_area || 'unknown';
      subjectDistribution[subject] = (subjectDistribution[subject] || 0) + 1;
    });

    // Calculate difficulty distribution
    const difficultyDistribution: Record<string, number> = {};
    reviews.forEach(review => {
      const difficulty = review.flashcard?.difficulty || 'unknown';
      difficultyDistribution[difficulty] = (difficultyDistribution[difficulty] || 0) + 1;
    });

    // Calculate predicted success rate (simplified)
    const predictedSuccessRate = Math.max(50, Math.min(95, statistics.retention_rate));

    // Calculate learning velocity (cards learned per day over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviews.filter(r => new Date(r.review_time) >= thirtyDaysAgo);
    const learningVelocity = recentReviews.length / 30;

    // Calculate daily goal progress (assuming 20 reviews per day goal)
    const dailyGoalProgress = Math.min(100, (reviewsToday / 20) * 100);

    // Estimate average memory strength
    const memoryStrengthAverage = 75; // Simplified calculation

    return {
      totalCards: statistics.total_cards || 0,
      cardsDue: statistics.cards_due || 0,
      cardsLearned: statistics.cards_learned || 0,
      cardsMastered: statistics.cards_mastered || 0,
      retentionRate: statistics.retention_rate || 0,
      streakDays: statistics.streak_days || 0,
      averageResponseTime,
      predictedSuccessRate,
      learningVelocity,
      dailyGoalProgress,
      weeklyReviewCount,
      subjectDistribution,
      difficultyDistribution,
      memoryStrengthAverage,
      // Duplicate properties for backward compatibility
      retention_rate: statistics.retention_rate || 0,
      cards_mastered: statistics.cards_mastered || 0,
      streak_days: statistics.streak_days || 0,
      total_cards: statistics.total_cards || 0,
      last_study_date: statistics.last_study_date,
      reviewsToday,
      correctReviewsToday,
    };
  }, [statistics, reviews]);

  return {
    data,
    isLoading: statsLoading || reviewsLoading,
  };
}
