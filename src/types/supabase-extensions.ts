
// This file extends the Supabase database types with our custom tables

// Use declaration merging to extend the Database interface
import type { Database as SupabaseDB } from '@/integrations/supabase/types';

// Extend the Database interface with our custom tables
declare module '@/integrations/supabase/types' {
  interface Database extends SupabaseDB {
    public: {
      Tables: {
        // Include existing tables
        arena_matches: SupabaseDB['public']['Tables']['arena_matches'];
        arena_stats: SupabaseDB['public']['Tables']['arena_stats'];
        flashcards: SupabaseDB['public']['Tables']['flashcards'];
        match_players: SupabaseDB['public']['Tables']['match_players'];
        ocr_uploads: SupabaseDB['public']['Tables']['ocr_uploads'];
        profiles: SupabaseDB['public']['Tables']['profiles'];
        quiz_questions: SupabaseDB['public']['Tables']['quiz_questions'];
        user_achievements: SupabaseDB['public']['Tables']['user_achievements'];
        
        // New chat-related tables
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
      Views: SupabaseDB['public']['Views'];
      Functions: SupabaseDB['public']['Functions'];
      Enums: SupabaseDB['public']['Enums'];
      CompositeTypes: SupabaseDB['public']['CompositeTypes'];
    };
  }
}
