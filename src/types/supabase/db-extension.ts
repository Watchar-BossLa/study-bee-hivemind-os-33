
// This file extends the Database interface with our custom tables
import type { Database } from '@/integrations/supabase/types';
import { ArenaChatMessagesTable } from './arena-chat';
import { ArenaTypingStatusTable } from './arena-typing';

// Extend the Database interface without conflict
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        // Include all existing tables
        arena_matches: Database['public']['Tables']['arena_matches'];
        arena_stats: Database['public']['Tables']['arena_stats'];
        course_bookmarks: Database['public']['Tables']['course_bookmarks'];
        flashcards: Database['public']['Tables']['flashcards'];
        match_players: Database['public']['Tables']['match_players'];
        ocr_uploads: Database['public']['Tables']['ocr_uploads'];
        profiles: Database['public']['Tables']['profiles'];
        quiz_questions: Database['public']['Tables']['quiz_questions'];
        user_achievements: Database['public']['Tables']['user_achievements'];
        
        // Add our custom tables
        arena_chat_messages: ArenaChatMessagesTable;
        arena_typing_status: ArenaTypingStatusTable;
      };
      Views: Database['public']['Views'];
      Functions: Database['public']['Functions'];
      Enums: Database['public']['Enums'];
      CompositeTypes: Database['public']['CompositeTypes'];
    }
  }
}
