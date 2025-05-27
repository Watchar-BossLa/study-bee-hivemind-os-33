
import { PolicyGradientEngine, RLState, RLAction } from './rlEngine/PolicyGradientEngine';
import { RewardCalculator, ReviewOutcome } from './rlEngine/RewardCalculator';
import { UserPerformanceMetrics } from './types';

export interface EnhancedSM2Result {
  nextReviewDate: Date;
  easinessFactor: number;
  consecutiveCorrect: number;
  interval: number;
  confidence: number;
  rlMetrics: {
    reward: number;
    action: RLAction;
    policyPerformance: {
      averageReward: number;
      explorationRate: number;
      policyEntropy: number;
    };
  };
}

export class EnhancedSM2Algorithm {
  private rlEngine: PolicyGradientEngine;
  private rewardCalculator: RewardCalculator;
  private userProfiles: Map<string, UserPerformanceMetrics>;

  constructor() {
    this.rlEngine = new PolicyGradientEngine();
    this.rewardCalculator = new RewardCalculator();
    this.userProfiles = new Map();
  }

  public calculateNextReview(
    consecutiveCorrect: number,
    easinessFactor: number,
    wasCorrect: boolean,
    responseTimeMs?: number,
    userMetrics?: UserPerformanceMetrics,
    cardDifficulty: number = 5,
    userId?: string
  ): EnhancedSM2Result {
    // Build RL state
    const state: RLState = {
      easinessFactor,
      consecutiveCorrect,
      responseTimeRatio: this.calculateResponseTimeRatio(responseTimeMs, userMetrics),
      retentionRate: userMetrics?.retentionRate || 90,
      streakDays: userMetrics?.streakDays || 0,
      difficultyLevel: cardDifficulty
    };

    // Generate RL action
    const rlAction = this.rlEngine.generateAction(state);

    // Apply traditional SM-2 with RL modifications
    let newConsecutiveCorrect = consecutiveCorrect;
    let newEasinessFactor = easinessFactor;

    if (wasCorrect) {
      newConsecutiveCorrect += 1;
      // RL-enhanced easiness adjustment
      const baseAdjustment = 0.1 - (5 - cardDifficulty) * (0.08 + 0.02);
      const rlAdjustment = rlAction.difficultyAdjustment;
      newEasinessFactor += baseAdjustment + rlAdjustment;
    } else {
      newConsecutiveCorrect = 0;
      newEasinessFactor -= 0.2;
    }

    // Clamp easiness factor
    newEasinessFactor = Math.max(1.3, Math.min(2.5, newEasinessFactor));

    // Calculate interval with RL optimization
    const baseInterval = this.calculateBaseInterval(newConsecutiveCorrect, newEasinessFactor);
    const rlModifiedInterval = baseInterval * rlAction.intervalMultiplier;
    const finalInterval = Math.max(1, Math.round(rlModifiedInterval));

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + finalInterval);

    // Calculate confidence with RL boost
    const baseConfidence = this.calculateBaseConfidence(
      newConsecutiveCorrect, 
      newEasinessFactor, 
      responseTimeMs, 
      userMetrics
    );
    const confidence = Math.min(1.0, baseConfidence + rlAction.confidenceBoost);

    // Calculate reward for RL learning
    const reviewOutcome: ReviewOutcome = {
      wasCorrect,
      responseTimeMs: responseTimeMs || 0,
      expectedResponseTime: userMetrics?.averageResponseTimeMs || 3000,
      difficultyLevel: cardDifficulty,
      previousInterval: baseInterval,
      actualInterval: finalInterval * 24 * 60 * 60 * 1000 // Convert to ms
    };

    const reward = this.rewardCalculator.calculateReward(reviewOutcome);

    // Update RL policy
    this.rlEngine.updatePolicy(state, rlAction, reward);

    // Get policy performance metrics
    const policyPerformance = this.rlEngine.getPerformanceMetrics();

    return {
      nextReviewDate,
      easinessFactor: newEasinessFactor,
      consecutiveCorrect: newConsecutiveCorrect,
      interval: finalInterval,
      confidence,
      rlMetrics: {
        reward,
        action: rlAction,
        policyPerformance
      }
    };
  }

  private calculateResponseTimeRatio(
    responseTimeMs?: number, 
    userMetrics?: UserPerformanceMetrics
  ): number {
    if (!responseTimeMs || !userMetrics?.averageResponseTimeMs) {
      return 1.0;
    }
    return responseTimeMs / userMetrics.averageResponseTimeMs;
  }

  private calculateBaseInterval(consecutiveCorrect: number, easinessFactor: number): number {
    if (consecutiveCorrect === 0) return 1;
    if (consecutiveCorrect === 1) return 6;
    
    // SM-2 formula with exponential growth
    const previousInterval = consecutiveCorrect === 2 ? 6 : 
      Math.round(6 * Math.pow(easinessFactor, consecutiveCorrect - 2));
    
    return Math.round(previousInterval * easinessFactor);
  }

  private calculateBaseConfidence(
    consecutiveCorrect: number,
    easinessFactor: number,
    responseTimeMs?: number,
    userMetrics?: UserPerformanceMetrics
  ): number {
    // Base confidence from consecutive correct answers
    const streakConfidence = Math.min(0.9, consecutiveCorrect * 0.15);
    
    // Easiness factor contribution
    const easeConfidence = (easinessFactor - 1.3) / 1.2 * 0.3;
    
    // Response time contribution
    let timeConfidence = 0.2;
    if (responseTimeMs && userMetrics?.averageResponseTimeMs) {
      const ratio = responseTimeMs / userMetrics.averageResponseTimeMs;
      timeConfidence = ratio >= 0.5 && ratio <= 2.0 ? 0.3 : 0.1;
    }
    
    return Math.min(1.0, streakConfidence + easeConfidence + timeConfidence);
  }

  public updateUserProfile(userId: string, metrics: UserPerformanceMetrics): void {
    this.userProfiles.set(userId, metrics);
  }

  public getUserProfile(userId: string): UserPerformanceMetrics | undefined {
    return this.userProfiles.get(userId);
  }

  public exportPolicyWeights(): string {
    // Export for model persistence
    return JSON.stringify({
      weights: Array.from(this.rlEngine['policyWeights'].entries()),
      performance: this.rlEngine.getPerformanceMetrics(),
      timestamp: new Date().toISOString()
    });
  }

  public importPolicyWeights(weightsData: string): void {
    try {
      const data = JSON.parse(weightsData);
      if (data.weights) {
        this.rlEngine['policyWeights'] = new Map(data.weights);
      }
    } catch (error) {
      console.error('Failed to import policy weights:', error);
    }
  }
}

// Singleton instance for global use
export const enhancedSM2 = new EnhancedSM2Algorithm();
