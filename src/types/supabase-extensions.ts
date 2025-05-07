
// This file extends the Supabase database types with our custom tables

// We need to use declaration merging to extend the Database interface
// Use 'import type' to avoid actually importing the module
import type { Database as SupabaseDatabase } from '@/integrations/supabase/types';

// Use module augmentation to extend the Database interface
declare module '@/integrations/supabase/types' {
  interface Database extends SupabaseDatabase {
    public: {
      Tables: {
        // Include all existing tables from the original Database type
        arena_matches: SupabaseDatabase['public']['Tables']['arena_matches'];
        arena_stats: SupabaseDatabase['public']['Tables']['arena_stats'];
        flashcards: SupabaseDatabase['public']['Tables']['flashcards'];
        match_players: SupabaseDatabase['public']['Tables']['match_players'];
        ocr_uploads: SupabaseDatabase['public']['Tables']['ocr_uploads'];
        profiles: SupabaseDatabase['public']['Tables']['profiles'];
        quiz_questions: SupabaseDatabase['public']['Tables']['quiz_questions'];
        user_achievements: SupabaseDatabase['public']['Tables']['user_achievements'];
        
        // New tables that we're adding
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
      Views: SupabaseDatabase['public']['Views'];
      Functions: SupabaseDatabase['public']['Functions'];
      Enums: SupabaseDatabase['public']['Enums'];
      CompositeTypes: SupabaseDatabase['public']['CompositeTypes'];
    };
  }
}
