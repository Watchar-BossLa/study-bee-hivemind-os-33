
// Enhanced SuperMemo SM-2⁺ algorithm implementation with reinforcement learning tuning
export interface ReviewResult {
  easinessFactor: number;
  nextReviewDate: Date;
  consecutiveCorrect: number;
  intervalDays: number;
  retention: number;
}

// User performance metrics to help with RL fine-tuning
export interface UserPerformanceMetrics {
  averageResponseTimeMs: number;
  retentionRate: number;
  totalReviews: number;
  streakDays: number;
}

/**
 * SM-2⁺ algorithm with reinforcement learning policy modification
 * Adjusts intervals based on user performance metrics and response data
 */
export function calculateNextReview(
  consecutiveCorrect: number,
  easinessFactor: number,
  wasCorrect: boolean,
  responseTimeMs?: number,
  performanceMetrics?: UserPerformanceMetrics
): ReviewResult {
  // Base easiness adjustment - more severe penalty for incorrect answers
  const baseEasiness = wasCorrect ? 
    Math.max(1.3, easinessFactor + 0.1) : 
    Math.max(1.3, easinessFactor - 0.3);
  
  // Apply RL policy modifications based on performance metrics
  let adjustedEasiness = baseEasiness;
  if (performanceMetrics) {
    // Adjust based on overall retention rate
    if (performanceMetrics.retentionRate < 85) {
      adjustedEasiness *= 0.95; // Make intervals shorter if retention is low
    } else if (performanceMetrics.retentionRate > 95) {
      adjustedEasiness *= 1.05; // Make intervals longer if retention is high
    }
    
    // Adjust for streak - reward consistent study
    if (performanceMetrics.streakDays > 7) {
      adjustedEasiness *= 1.02;
    }
  }
  
  // Response time adjustment - faster responses indicate stronger recall
  if (responseTimeMs && wasCorrect) {
    // Normalize response time (adjust thresholds based on application data)
    const avgResponseTime = performanceMetrics?.averageResponseTimeMs || 3000;
    const normalizedTime = Math.min(Math.max(responseTimeMs / avgResponseTime, 0.5), 1.5);
    
    // Faster responses get slightly longer intervals
    adjustedEasiness *= (2 - normalizedTime);
  }
  
  const newConsecutive = wasCorrect ? consecutiveCorrect + 1 : 0;
  
  // Calculate interval days with SM-2⁺ algorithm
  let intervalDays;
  if (!wasCorrect) {
    // If incorrect, review again soon but not immediately (spaced repetition principle)
    intervalDays = 1;
  } else {
    if (newConsecutive === 1) {
      intervalDays = 1; // First correct response
    } else if (newConsecutive === 2) {
      intervalDays = 6; // Second correct response
    } else {
      // For subsequent correct responses, use the SM-2 formula with our adjustments
      intervalDays = Math.round((consecutiveCorrect) * adjustedEasiness);
    }
  }
  
  // Calculate estimated retention based on interval and easiness
  const retention = calculateRetention(intervalDays, adjustedEasiness);
  
  // Generate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  
  return {
    easinessFactor: adjustedEasiness,
    nextReviewDate: nextReview,
    consecutiveCorrect: newConsecutive,
    intervalDays,
    retention
  };
}

/**
 * Estimates memory retention percentage based on the interval and easiness factor
 * Uses the Ebbinghaus forgetting curve with SM-2⁺ parameter adjustments
 */
function calculateRetention(intervalDays: number, easinessFactor: number): number {
  // Simplified retention calculation based on interval and easiness
  // R = e^(-t/S) where t is time and S is strength (related to easiness)
  const stabilityFactor = 2 * easinessFactor;
  const retention = 100 * Math.exp(-intervalDays / stabilityFactor);
  return Math.max(0, Math.min(100, retention));
}

/**
 * Retrieve optimal study time using the SM-2⁺ algorithm
 * Returns the ideal time to review a card to maximize long-term retention
 */
export function getOptimalReviewTime(
  lastReviewDate: Date, 
  easinessFactor: number,
  consecutiveCorrect: number
): Date {
  let intervalDays = 1;
  
  if (consecutiveCorrect === 1) {
    intervalDays = 1;
  } else if (consecutiveCorrect === 2) {
    intervalDays = 6;
  } else if (consecutiveCorrect > 2) {
    intervalDays = Math.round((consecutiveCorrect - 1) * easinessFactor);
  }
  
  const optimalDate = new Date(lastReviewDate);
  optimalDate.setDate(optimalDate.getDate() + intervalDays);
  return optimalDate;
}
