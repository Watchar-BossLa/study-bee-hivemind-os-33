// This file extends the Supabase database types with our custom tables
import type { Database as OriginalDatabase } from '@/integrations/supabase/types';

// Use declaration merging to extend the Database interface
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        // Keep existing tables
        arena_matches: OriginalDatabase['public']['Tables']['arena_matches'];
        arena_stats: OriginalDatabase['public']['Tables']['arena_stats'];
        flashcards: OriginalDatabase['public']['Tables']['flashcards'];
        match_players: OriginalDatabase['public']['Tables']['match_players'];
        ocr_uploads: OriginalDatabase['public']['Tables']['ocr_uploads'];
        profiles: OriginalDatabase['public']['Tables']['profiles'];
        quiz_questions: OriginalDatabase['public']['Tables']['quiz_questions'];
        user_achievements: OriginalDatabase['public']['Tables']['user_achievements'];
        
        // Add new chat-related tables
        arena_chat_messages: {
          Row: {
            id: string;
            match_id: string;
            user_id: string;
            content: string;
            created_at: string;
          };
          Insert: {
            id?: string;
            match_id: string;
            user_id: string;
            content: string;
            created_at?: string;
          };
          Update: {
            id?: string;
            match_id?: string;
            user_id?: string;
            content?: string;
            created_at?: string;
          };
          Relationships: [
            {
              foreignKeyName: "arena_chat_messages_match_id_fkey";
              columns: ["match_id"];
              isOneToOne: false;
              referencedRelation: "arena_matches";
              referencedColumns: ["id"];
            }
          ];
        };
        arena_typing_status: {
          Row: {
            user_id: string;
            match_id: string;
            is_typing: boolean;
            last_updated: string;
          };
          Insert: {
            user_id: string;
            match_id: string;
            is_typing?: boolean;
            last_updated?: string;
          };
          Update: {
            user_id?: string;
            match_id?: string;
            is_typing?: boolean;
            last_updated?: string;
          };
          Relationships: [
            {
              foreignKeyName: "arena_typing_status_match_id_fkey";
              columns: ["match_id"];
              isOneToOne: false;
              referencedRelation: "arena_matches";
              referencedColumns: ["id"];
            }
          ];
        };
      };
      Views: OriginalDatabase['public']['Views'];
      Functions: OriginalDatabase['public']['Functions'];
      Enums: OriginalDatabase['public']['Enums'];
      CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
    };
  }
}
