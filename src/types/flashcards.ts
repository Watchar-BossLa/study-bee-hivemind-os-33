
export interface FlashcardReview {
  id: string;
  flashcard_id: string;
  was_correct: boolean;
  response_time_ms: number | null;
  review_time: string;
  flashcard?: {
    question: string;
    subject_area: string | null;
    difficulty: string | null;
  };
}

export interface FlashcardStatistics {
  total_cards: number;
  cards_due: number;
  cards_learned: number;
  cards_mastered: number;
  total_reviews: number;
  correct_reviews: number;
  retention_rate: number;
  average_interval: number;
  streak_days: number;
  last_study_date: string | null;
  updated_at: string;
}

export interface StudyTimeData {
  totalTimeMs: number;
  sessions: number;
  uniqueCards: number;
  averageTimePerCardMs: number;
  totalStudyTimeMs: number;
  averageSessionLength: number;
  studySessionsCount: number;
  dailyStudyTime: Record<string, number>;
  weeklyStudyTime: Record<string, number>;
  longestSession: number;
  shortestSession: number;
  studyEfficiency: number;
}

export interface HeatmapData {
  date: string;
  count: number;
  level: number;
  correct: number;
  accuracy: number;
}

export interface AnalyticsSummary extends FlashcardStatistics {
  reviewsToday: number;
  correctReviewsToday: number;
  retention_rate: number;
  cards_mastered: number;
  streak_days: number;
  total_cards: number;
}
