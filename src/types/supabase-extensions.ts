// This file extends the Supabase database types with our custom tables

// Module augmentation syntax for extending existing Database interface
// Use declare global to avoid duplicate identifier errors
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        // Keep existing tables
        arena_matches: Database['public']['Tables']['arena_matches'];
        arena_stats: Database['public']['Tables']['arena_stats'];
        flashcards: Database['public']['Tables']['flashcards'];
        match_players: Database['public']['Tables']['match_players'];
        ocr_uploads: Database['public']['Tables']['ocr_uploads'];
        profiles: Database['public']['Tables']['profiles'];
        quiz_questions: Database['public']['Tables']['quiz_questions'];
        user_achievements: Database['public']['Tables']['user_achievements'];
        
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
    };
  }
}

export {};
