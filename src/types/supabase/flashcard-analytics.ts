
export interface FlashcardReview {
  id: string;
  user_id: string;
  flashcard_id: string;
  was_correct: boolean;
  review_time: string;
  response_time_ms?: number | null;
  confidence_level?: number | null;
}

export interface FlashcardReviewsTable {
  Row: FlashcardReview;
  Insert: Omit<FlashcardReview, 'id'> & { id?: string };
  Update: Partial<FlashcardReview>;
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
  Row: FlashcardStatistics;
  Insert: Omit<FlashcardStatistics, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
  Update: Partial<FlashcardStatistics>;
}

export interface FlashcardAnalyticsSummary {
  totalCards: number;
  cardsDue: number;
  cardsLearned: number;
  cardsMastered: number;
  retentionRate: number;
  streak: number;
  studyTimeToday: number; // minutes
  reviewsToday: number;
  correctReviewsToday: number;
}
