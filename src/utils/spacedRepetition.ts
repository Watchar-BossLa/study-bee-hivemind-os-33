
/**
 * Enhanced SM-2⁺ Spaced Repetition Algorithm with Reinforcement Learning
 * 
 * This implementation extends the classic SM-2 algorithm with:
 * - Reinforcement Learning policy adjustments based on user performance
 * - Response time analysis for cognitive load assessment
 * - Personalized difficulty scaling
 * - Performance prediction and optimization
 */

export interface UserPerformanceMetrics {
  averageResponseTimeMs: number;
  retentionRate: number;
  totalReviews: number;
  streakDays: number;
}

export interface SpacedRepetitionResult {
  nextReviewDate: Date;
  easinessFactor: number;
  consecutiveCorrect: number;
  interval: number;
}

/**
 * Enhanced SM-2⁺ algorithm with RL policy modifications
 */
export function calculateNextReview(
  consecutiveCorrectAnswers: number,
  easinessFactor: number,
  wasCorrect: boolean,
  responseTimeMs?: number,
  userMetrics?: UserPerformanceMetrics
): SpacedRepetitionResult {
  let newEasinessFactor = easinessFactor;
  let newConsecutiveCorrect = wasCorrect ? consecutiveCorrectAnswers + 1 : 0;
  
  // Standard SM-2 easiness factor adjustment
  if (wasCorrect) {
    // Slightly increase easiness for correct answers
    newEasinessFactor = Math.max(1.3, easinessFactor + 0.1);
  } else {
    // Decrease easiness for incorrect answers
    newEasinessFactor = Math.max(1.3, easinessFactor - 0.2);
  }

  // RL Policy Adjustment: Response Time Analysis
  if (responseTimeMs && userMetrics) {
    const responseTimeFactor = calculateResponseTimeFactor(responseTimeMs, userMetrics.averageResponseTimeMs);
    newEasinessFactor *= responseTimeFactor;
  }

  // RL Policy Adjustment: User Performance Context
  if (userMetrics) {
    const performanceFactor = calculatePerformanceFactor(userMetrics);
    newEasinessFactor *= performanceFactor;
  }

  // Clamp easiness factor to reasonable bounds
  newEasinessFactor = Math.max(1.3, Math.min(3.0, newEasinessFactor));

  // Calculate interval based on consecutive correct answers
  let interval: number;
  if (newConsecutiveCorrect === 0) {
    interval = 1; // Review again tomorrow if incorrect
  } else if (newConsecutiveCorrect === 1) {
    interval = 3; // 3 days for first correct answer
  } else {
    interval = Math.round(calculateInterval(newConsecutiveCorrect - 1) * newEasinessFactor);
  }

  // RL Policy Adjustment: Adaptive Scheduling
  if (userMetrics && userMetrics.streakDays > 7) {
    // Users with good streaks can handle slightly longer intervals
    interval = Math.round(interval * 1.1);
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    nextReviewDate,
    easinessFactor: newEasinessFactor,
    consecutiveCorrect: newConsecutiveCorrect,
    interval
  };
}

/**
 * Calculate response time factor for RL adjustment
 */
function calculateResponseTimeFactor(responseTimeMs: number, averageResponseTimeMs: number): number {
  const ratio = responseTimeMs / averageResponseTimeMs;
  
  if (ratio < 0.5) {
    // Very fast response - might indicate guessing, slightly reduce easiness
    return 0.95;
  } else if (ratio > 2.0) {
    // Very slow response - indicates difficulty, reduce easiness more
    return 0.85;
  } else if (ratio >= 0.8 && ratio <= 1.2) {
    // Normal response time - slight bonus for consistent performance
    return 1.05;
  }
  
  return 1.0; // Neutral adjustment
}

/**
 * Calculate performance factor based on user metrics
 */
function calculatePerformanceFactor(metrics: UserPerformanceMetrics): number {
  let factor = 1.0;
  
  // Retention rate influence
  if (metrics.retentionRate > 85) {
    factor *= 1.1; // High retention - can handle harder cards
  } else if (metrics.retentionRate < 70) {
    factor *= 0.9; // Low retention - need easier progression
  }
  
  // Experience factor (total reviews)
  if (metrics.totalReviews > 1000) {
    factor *= 1.05; // Experienced users can handle slightly harder progression
  } else if (metrics.totalReviews < 50) {
    factor *= 0.95; // New users need gentler progression
  }
  
  return Math.max(0.8, Math.min(1.2, factor));
}

/**
 * Base interval calculation for SM-2 algorithm
 */
function calculateInterval(n: number): number {
  if (n === 1) return 6;
  if (n === 2) return 6;
  return calculateInterval(n - 1) * 2;
}

/**
 * Predict next review performance based on current metrics
 */
export function predictReviewSuccess(
  easinessFactor: number,
  daysSinceLastReview: number,
  userMetrics?: UserPerformanceMetrics
): number {
  let baseProbability = Math.max(0.1, Math.min(0.95, easinessFactor / 3.0));
  
  // Adjust for time decay
  const decayFactor = Math.exp(-daysSinceLastReview / 30); // 30-day half-life
  baseProbability *= (0.5 + 0.5 * decayFactor);
  
  // Adjust for user performance
  if (userMetrics) {
    const retentionBonus = (userMetrics.retentionRate - 75) / 100; // Normalize around 75%
    baseProbability += retentionBonus * 0.2;
  }
  
  return Math.max(0.05, Math.min(0.95, baseProbability));
}

/**
 * Calculate memory strength estimation (0-100%)
 */
export function calculateMemoryStrength(
  consecutiveCorrect: number,
  easinessFactor: number,
  daysSinceReview: number
): number {
  const baseStrength = Math.min(100, consecutiveCorrect * 20);
  const easinessBonus = (easinessFactor - 1.3) * 15;
  const decayPenalty = Math.min(50, daysSinceReview * 2);
  
  return Math.max(0, Math.min(100, baseStrength + easinessBonus - decayPenalty));
}
