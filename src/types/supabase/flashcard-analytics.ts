
export interface FlashcardReview {
  id: string;
  user_id: string;
  flashcard_id: string;
  was_correct: boolean;
  review_time: string;
  response_time_ms?: number;
  confidence_level?: number;
}

export interface FlashcardReviewsTable {
  id: string;
  user_id: string;
  flashcard_id: string;
  was_correct: boolean;
  review_time: string;
  response_time_ms?: number;
  confidence_level?: number;
}

export interface FlashcardStatistics {
  id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
}

export interface FlashcardStatisticsTable {
  id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
}

export interface FlashcardAnalyticsSummary {
  total_cards: number;
  cards_due: number;
  cards_mastered: number;
  retention_rate: number;
  streak_days: number;
  last_study_date: string | null;
  reviewsToday: number;
  correctReviewsToday: number;
  studyTimeToday?: number;
}
