
// This file extends the Database interface with our custom tables
import type { Database as SupabaseDatabase } from '@/integrations/supabase/types';
import type { ArenaChatMessagesTable } from './arena-chat';
import type { ArenaTypingStatusTable } from './arena-typing';
import type { FlashcardReviewsTable, FlashcardStatisticsTable } from './flashcard-analytics';

// Use module augmentation to extend the Database interface
declare global {
  namespace SupabaseTypes {
    interface Database {
      public: {
        Tables: {
          // Include all existing tables
          arena_matches: SupabaseDatabase['public']['Tables']['arena_matches'];
          arena_stats: SupabaseDatabase['public']['Tables']['arena_stats'];
          course_bookmarks: SupabaseDatabase['public']['Tables']['course_bookmarks'];
          flashcards: SupabaseDatabase['public']['Tables']['flashcards'];
          match_players: SupabaseDatabase['public']['Tables']['match_players'];
          ocr_uploads: SupabaseDatabase['public']['Tables']['ocr_uploads'];
          profiles: SupabaseDatabase['public']['Tables']['profiles'];
          quiz_questions: SupabaseDatabase['public']['Tables']['quiz_questions'];
          user_achievements: SupabaseDatabase['public']['Tables']['user_achievements'];
          
          // Add our custom tables
          arena_chat_messages: ArenaChatMessagesTable;
          arena_typing_status: ArenaTypingStatusTable;
          
          // Add new flashcard analytics tables
          flashcard_reviews: FlashcardReviewsTable;
          flashcard_statistics: FlashcardStatisticsTable;
        };
        Views: SupabaseDatabase['public']['Views'];
        Functions: SupabaseDatabase['public']['Functions'];
        Enums: SupabaseDatabase['public']['Enums'];
        CompositeTypes: SupabaseDatabase['public']['CompositeTypes'];
      }
    }
  }
}

// No need to export anything as this is just type augmentation
