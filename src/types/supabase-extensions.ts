
// This file extends the Supabase database types with our custom tables
import type { Database as SupabaseDatabase } from '@/integrations/supabase/types';

// Use declaration merging to extend the Database type
declare module '@/integrations/supabase/types' {
  // Extend the existing Database interface
  export interface Database extends SupabaseDatabase {
    public: {
      Tables: {
        // Include existing tables
        arena_matches: SupabaseDatabase['public']['Tables']['arena_matches'];
        arena_stats: SupabaseDatabase['public']['Tables']['arena_stats'];
        flashcards: SupabaseDatabase['public']['Tables']['flashcards'];
        match_players: SupabaseDatabase['public']['Tables']['match_players'];
        ocr_uploads: SupabaseDatabase['public']['Tables']['ocr_uploads'];
        profiles: SupabaseDatabase['public']['Tables']['profiles'];
        quiz_questions: SupabaseDatabase['public']['Tables']['quiz_questions'];
        user_achievements: SupabaseDatabase['public']['Tables']['user_achievements'];
        
        // Add new tables
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
