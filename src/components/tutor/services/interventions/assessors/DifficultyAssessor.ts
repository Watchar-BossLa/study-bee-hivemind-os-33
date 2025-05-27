
import { AdaptationAction, RealTimeMetrics, AdaptationThresholds } from '../types/AdaptationTypes';
import { SessionData } from '../../analytics/types/AnalyticsTypes';

export class DifficultyAssessor {
  constructor(private thresholds: AdaptationThresholds) {}

  public assess(metrics: RealTimeMetrics, sessionData: SessionData): AdaptationAction | null {
    const { currentAccuracy, consecutiveCorrect, consecutiveIncorrect } = metrics;
    const { difficulty } = sessionData;

    // Increase difficulty if performing well
    if (currentAccuracy >= this.thresholds.difficultyIncrease.accuracy && 
        consecutiveCorrect >= this.thresholds.difficultyIncrease.consecutiveCorrect &&
        difficulty < 10) {
      return {
        id: `difficulty_up_${Date.now()}`,
        type: 'difficulty_adjustment',
        description: 'Increasing difficulty level due to high performance',
        parameters: {
          currentDifficulty: difficulty,
          newDifficulty: Math.min(10, difficulty + 1),
          reason: 'high_performance'
        },
        confidence: 0.8,
        appliedAt: new Date()
      };
    }

    // Decrease difficulty if struggling
    if (currentAccuracy <= this.thresholds.difficultyDecrease.accuracy && 
        consecutiveIncorrect >= this.thresholds.difficultyDecrease.consecutiveIncorrect &&
        difficulty > 1) {
      return {
        id: `difficulty_down_${Date.now()}`,
        type: 'difficulty_adjustment',
        description: 'Decreasing difficulty level due to struggling performance',
        parameters: {
          currentDifficulty: difficulty,
          newDifficulty: Math.max(1, difficulty - 1),
          reason: 'struggling_performance'
        },
        confidence: 0.85,
        appliedAt: new Date()
      };
    }

    return null;
  }
}
