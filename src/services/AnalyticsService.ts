
import { FlashcardService } from './FlashcardService';
import { ANALYTICS_CONSTANTS } from '@/config/constants';

export class AnalyticsService {
  static async getSummaryData(userId: string) {
    const [statistics, reviews] = await Promise.all([
      FlashcardService.getStatistics(userId),
      FlashcardService.getRecentReviews(userId, ANALYTICS_CONSTANTS.RECENT_REVIEWS_LIMIT)
    ]);

    if (!statistics || !reviews) return null;

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

    return {
      ...statistics,
      reviewsToday,
      correctReviewsToday,
    };
  }

  static calculateHeatmapData(rawData: any[], days: number) {
    // Group reviews by date
    const reviewsByDate: Record<string, { count: number; correct: number }> = {};
    
    rawData.forEach(review => {
      const date = new Date(review.review_time).toISOString().split('T')[0];
      if (!reviewsByDate[date]) {
        reviewsByDate[date] = { count: 0, correct: 0 };
      }
      reviewsByDate[date].count += 1;
      if (review.was_correct) {
        reviewsByDate[date].correct += 1;
      }
    });

    // Generate complete date range
    const result = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const dayData = reviewsByDate[dateString] || { count: 0, correct: 0 };
      const count = dayData.count;
      const correct = dayData.correct;
      const accuracy = count > 0 ? Math.round((correct / count) * 100) : 0;
      
      let level = 0;
      if (count > 0) {
        if (count >= 50) level = 4;
        else if (count >= 30) level = 3;
        else if (count >= 15) level = 2;
        else level = 1;
      }

      result.push({
        date: dateString,
        count,
        level,
        correct,
        accuracy,
      });
    }

    return result;
  }
}
