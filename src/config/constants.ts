
export const ANALYTICS_CONSTANTS = {
  RECENT_REVIEWS_LIMIT: 500,
  HEATMAP_DEFAULT_DAYS: 365,
  STUDY_TIME_SESSION_GAP_MS: 30 * 60 * 1000, // 30 minutes
  DAILY_GOAL_REVIEWS: 20,
  MEMORY_STRENGTH_THRESHOLDS: {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 80
  }
} as const;

export const SPACED_REPETITION_CONSTANTS = {
  MIN_EASINESS_FACTOR: 1.3,
  MAX_EASINESS_FACTOR: 3.0,
  DEFAULT_EASINESS_FACTOR: 2.5,
  INITIAL_INTERVAL_DAYS: 3,
  MINIMUM_RESPONSE_TIME_MS: 100,
  STREAK_BONUS_MULTIPLIER: 1.1
} as const;

export const UI_CONSTANTS = {
  SKELETON_COUNT: 5,
  PAGINATION_DEFAULT_LIMIT: 20,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY_MS: 300
} as const;
