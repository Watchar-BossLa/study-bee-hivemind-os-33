
// SuperMemo SM-2 algorithm implementation
export interface ReviewResult {
  easinessFactor: number;
  nextReviewDate: Date;
  consecutiveCorrect: number;
}

export function calculateNextReview(
  easinessFactor: number,
  consecutiveCorrect: number,
  wasCorrect: boolean
): ReviewResult {
  if (!wasCorrect) {
    return {
      easinessFactor: Math.max(1.3, easinessFactor - 0.2),
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Review tomorrow
      consecutiveCorrect: 0,
    };
  }

  const newConsecutive = consecutiveCorrect + 1;
  const newEasiness = Math.max(1.3, easinessFactor + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02)));
  
  // Calculate days until next review based on consecutive correct answers
  let daysUntilReview = 1;
  if (newConsecutive === 1) daysUntilReview = 1;
  else if (newConsecutive === 2) daysUntilReview = 6;
  else daysUntilReview = Math.round(daysUntilReview * newEasiness);

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + daysUntilReview);

  return {
    easinessFactor: newEasiness,
    nextReviewDate: nextReview,
    consecutiveCorrect: newConsecutive,
  };
}
