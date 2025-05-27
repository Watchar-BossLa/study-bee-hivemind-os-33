
export interface ReviewOutcome {
  wasCorrect: boolean;
  responseTimeMs: number;
  expectedResponseTime: number;
  difficultyLevel: number;
  previousInterval: number;
  actualInterval: number;
}

export class RewardCalculator {
  private readonly weights = {
    accuracy: 0.4,
    efficiency: 0.3,
    retention: 0.2,
    engagement: 0.1
  };

  public calculateReward(outcome: ReviewOutcome): number {
    const accuracyReward = this.calculateAccuracyReward(outcome.wasCorrect);
    const efficiencyReward = this.calculateEfficiencyReward(
      outcome.responseTimeMs, 
      outcome.expectedResponseTime
    );
    const retentionReward = this.calculateRetentionReward(
      outcome.actualInterval, 
      outcome.previousInterval,
      outcome.wasCorrect
    );
    const engagementReward = this.calculateEngagementReward(
      outcome.responseTimeMs,
      outcome.difficultyLevel
    );

    const totalReward = 
      this.weights.accuracy * accuracyReward +
      this.weights.efficiency * efficiencyReward +
      this.weights.retention * retentionReward +
      this.weights.engagement * engagementReward;

    return Math.max(-1.0, Math.min(1.0, totalReward));
  }

  private calculateAccuracyReward(wasCorrect: boolean): number {
    return wasCorrect ? 1.0 : -0.5;
  }

  private calculateEfficiencyReward(actualTime: number, expectedTime: number): number {
    if (expectedTime === 0) return 0;
    
    const ratio = actualTime / expectedTime;
    
    // Optimal response time is around expected time
    if (ratio >= 0.8 && ratio <= 1.2) {
      return 1.0;
    } else if (ratio < 0.5) {
      // Too fast might indicate guessing
      return 0.3;
    } else if (ratio > 3.0) {
      // Too slow indicates struggle
      return -0.3;
    } else {
      // Linear interpolation for other cases
      return 1.0 - Math.abs(ratio - 1.0) * 0.5;
    }
  }

  private calculateRetentionReward(
    actualInterval: number, 
    previousInterval: number,
    wasCorrect: boolean
  ): number {
    if (!wasCorrect) {
      // Penalty for forgetting after longer intervals
      return -Math.min(actualInterval / (24 * 60 * 60 * 1000), 1.0) * 0.5;
    }
    
    // Reward for successful retention over longer intervals
    const intervalRatio = actualInterval / Math.max(previousInterval, 1);
    return Math.min(intervalRatio * 0.3, 1.0);
  }

  private calculateEngagementReward(responseTime: number, difficultyLevel: number): number {
    // Reward appropriate engagement time based on difficulty
    const expectedEngagementTime = difficultyLevel * 2000; // 2s per difficulty level
    const ratio = responseTime / expectedEngagementTime;
    
    // Sweet spot for engagement
    if (ratio >= 0.5 && ratio <= 2.0) {
      return 1.0 - Math.abs(ratio - 1.0) * 0.3;
    }
    
    return Math.max(0.0, 1.0 - Math.abs(ratio - 1.0));
  }

  public calculateLongTermReward(
    reviewHistory: Array<{ wasCorrect: boolean; interval: number; timestamp: number }>
  ): number {
    if (reviewHistory.length < 2) return 0;

    const recentReviews = reviewHistory.slice(-10);
    const accuracy = recentReviews.filter(r => r.wasCorrect).length / recentReviews.length;
    
    // Calculate interval growth trend
    const intervals = recentReviews.map(r => r.interval);
    const avgIntervalGrowth = this.calculateTrendGrowth(intervals);
    
    // Calculate consistency
    const consistency = this.calculateConsistency(recentReviews.map(r => r.wasCorrect ? 1 : 0));
    
    return (accuracy * 0.5 + avgIntervalGrowth * 0.3 + consistency * 0.2) * 2 - 1;
  }

  private calculateTrendGrowth(values: number[]): number {
    if (values.length < 2) return 0;
    
    let growth = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i-1]) growth++;
    }
    
    return growth / (values.length - 1);
  }

  private calculateConsistency(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.max(0, 1 - Math.sqrt(variance));
  }
}
