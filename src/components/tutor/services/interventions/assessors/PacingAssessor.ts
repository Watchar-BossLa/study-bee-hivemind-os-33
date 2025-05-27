
import { AdaptationAction, RealTimeMetrics, AdaptationThresholds } from '../types/AdaptationTypes';
import { LearningPattern } from '../../analytics/core/LearningPatternAnalyzer';

export class PacingAssessor {
  constructor(private thresholds: AdaptationThresholds) {}

  public assess(metrics: RealTimeMetrics, pattern: LearningPattern): AdaptationAction | null {
    const avgResponseTime = metrics.responseTime;
    const historicalAverage = this.calculateHistoricalAverageResponseTime(pattern.userId);

    // Slow down if response time is significantly higher than usual
    if (avgResponseTime > historicalAverage * 1.5) {
      return {
        id: `pacing_slow_${Date.now()}`,
        type: 'pacing_change',
        description: 'Slowing down presentation pace due to increased response time',
        parameters: {
          currentPace: 'normal',
          newPace: 'slow',
          responseTimeRatio: avgResponseTime / historicalAverage,
          reason: 'slow_responses'
        },
        confidence: 0.7,
        appliedAt: new Date()
      };
    }

    // Speed up if response time is much faster than usual and accuracy is high
    if (avgResponseTime < historicalAverage * 0.7 && metrics.currentAccuracy > 0.8) {
      return {
        id: `pacing_fast_${Date.now()}`,
        type: 'pacing_change',
        description: 'Increasing presentation pace due to fast and accurate responses',
        parameters: {
          currentPace: 'normal',
          newPace: 'fast',
          responseTimeRatio: avgResponseTime / historicalAverage,
          accuracy: metrics.currentAccuracy,
          reason: 'fast_accurate_responses'
        },
        confidence: 0.75,
        appliedAt: new Date()
      };
    }

    return null;
  }

  private calculateHistoricalAverageResponseTime(userId: string): number {
    // Simplified - would normally query historical data
    return 15000; // 15 seconds average
  }
}
