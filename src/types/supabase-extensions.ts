
// This file re-exports all Supabase extension types
import './supabase/db-extension';
export type { ChatMessage, ArenaChatMessagesTable } from './supabase/arena-chat';
export type { TypingStatus, ArenaTypingStatusTable } from './supabase/arena-typing';
export type { FlashcardReview, FlashcardReviewsTable, FlashcardStatistics, FlashcardStatisticsTable, FlashcardAnalyticsSummary } from './supabase/flashcard-analytics';
