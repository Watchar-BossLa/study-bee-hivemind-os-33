
// Enhanced spaced repetition with RL optimization
import { enhancedSM2, EnhancedSM2Result } from './spacedRepetition/EnhancedSM2Algorithm';
import { UserPerformanceMetrics } from './spacedRepetition/types';

export type { UserPerformanceMetrics } from './spacedRepetition/types';

export interface ReviewResult extends EnhancedSM2Result {
  // Backward compatibility
  nextReviewDate: Date;
  easinessFactor: number;
  consecutiveCorrect: number;
}

/**
 * Enhanced SM-2+ algorithm with Reinforcement Learning optimization
 * 
 * @param consecutiveCorrect - Number of consecutive correct answers
 * @param easinessFactor - Current easiness factor (1.3 to 2.5)
 * @param wasCorrect - Whether the answer was correct
 * @param responseTimeMs - Time taken to respond in milliseconds
 * @param userMetrics - User's performance metrics for RL optimization
 * @param cardDifficulty - Difficulty level of the card (1-10)
 * @param userId - User ID for personalization
 * @returns Enhanced review result with RL metrics
 */
export function calculateNextReview(
  consecutiveCorrect: number,
  easinessFactor: number,
  wasCorrect: boolean,
  responseTimeMs?: number,
  userMetrics?: UserPerformanceMetrics,
  cardDifficulty: number = 5,
  userId?: string
): ReviewResult {
  const result = enhancedSM2.calculateNextReview(
    consecutiveCorrect,
    easinessFactor,
    wasCorrect,
    responseTimeMs,
    userMetrics,
    cardDifficulty,
    userId
  );

  return {
    ...result,
    // Maintain backward compatibility
    nextReviewDate: result.nextReviewDate,
    easinessFactor: result.easinessFactor,
    consecutiveCorrect: result.consecutiveCorrect
  };
}

/**
 * Update user performance profile for better RL optimization
 */
export function updateUserProfile(userId: string, metrics: UserPerformanceMetrics): void {
  enhancedSM2.updateUserProfile(userId, metrics);
}

/**
 * Get current user performance profile
 */
export function getUserProfile(userId: string): UserPerformanceMetrics | undefined {
  return enhancedSM2.getUserProfile(userId);
}

/**
 * Export policy weights for model persistence
 */
export function exportRLPolicy(): string {
  return enhancedSM2.exportPolicyWeights();
}

/**
 * Import policy weights for model loading
 */
export function importRLPolicy(weightsData: string): void {
  enhancedSM2.importPolicyWeights(weightsData);
}

/**
 * Calculate optimal review batch size based on user metrics
 */
export function calculateOptimalBatchSize(userMetrics: UserPerformanceMetrics): number {
  const baseSize = 20;
  const velocityMultiplier = (userMetrics.learningVelocity || 1.0);
  const cognitiveLoadAdjustment = 1.0 - (userMetrics.cognitiveLoad || 0.5);
  
  return Math.max(5, Math.min(50, Math.round(baseSize * velocityMultiplier * cognitiveLoadAdjustment)));
}

/**
 * Predict next session difficulty based on user performance
 */
export function predictSessionDifficulty(
  userMetrics: UserPerformanceMetrics, 
  recentAccuracy: number
): 'easy' | 'medium' | 'hard' | 'adaptive' {
  const cognitiveLoad = userMetrics.cognitiveLoad || 0.5;
  const retentionRate = userMetrics.retentionRate / 100.0;
  
  if (recentAccuracy > 0.85 && cognitiveLoad < 0.6 && retentionRate > 0.8) {
    return 'hard';
  } else if (recentAccuracy < 0.6 || cognitiveLoad > 0.8) {
    return 'easy';
  } else if (userMetrics.learningVelocity && userMetrics.learningVelocity > 1.2) {
    return 'adaptive';
  } else {
    return 'medium';
  }
}
