
export interface UserPerformanceMetrics {
  averageResponseTimeMs: number;
  retentionRate: number;
  totalReviews: number;
  streakDays: number;
  difficultyPreference?: number;
  learningVelocity?: number;
  cognitiveLoad?: number;
}

export interface FlashcardMetrics {
  cardId: string;
  difficulty: number;
  averageResponseTime: number;
  successRate: number;
  lastReviewed: Date;
  reviewCount: number;
  isStarred?: boolean;
}

export interface SpacedRepetitionConfig {
  minInterval: number; // minimum days between reviews
  maxInterval: number; // maximum days between reviews
  baseEasinessFactor: number;
  minimumEasinessFactor: number;
  maximumEasinessFactor: number;
  difficultyBonusThreshold: number;
  rlLearningRate: number;
  rlExplorationRate: number;
}

export const DEFAULT_CONFIG: SpacedRepetitionConfig = {
  minInterval: 1,
  maxInterval: 365,
  baseEasinessFactor: 2.5,
  minimumEasinessFactor: 1.3,
  maximumEasinessFactor: 2.5,
  difficultyBonusThreshold: 7,
  rlLearningRate: 0.001,
  rlExplorationRate: 0.1
};
