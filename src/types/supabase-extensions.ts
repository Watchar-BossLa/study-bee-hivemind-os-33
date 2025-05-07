// This file extends the Supabase database types with our custom tables

/**
 * Using module augmentation to extend the Supabase database types
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */

declare module '@/integrations/supabase/types' {
  export interface Database {
    public: {
      Tables: {
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
        arena_matches: {
          Row: {
            created_at: string | null;
            end_time: string | null;
            id: string;
            start_time: string | null;
            status: string;
            updated_at: string | null;
          };
          Insert: {
            created_at?: string | null;
            end_time?: string | null;
            id?: string;
            start_time?: string | null;
            status?: string;
            updated_at?: string | null;
          };
          Update: {
            created_at?: string | null;
            end_time?: string | null;
            id?: string;
            start_time?: string | null;
            status?: string;
            updated_at?: string | null;
          };
          Relationships: [];
        };
        arena_stats: {
          Row: {
            correct_answers: number;
            created_at: string | null;
            highest_score: number;
            last_match_date: string | null;
            matches_played: number;
            matches_won: number;
            questions_answered: number;
            total_score: number;
            updated_at: string | null;
            user_id: string;
          };
          Insert: {
            correct_answers?: number;
            created_at?: string | null;
            highest_score?: number;
            last_match_date?: string | null;
            matches_played?: number;
            matches_won?: number;
            questions_answered?: number;
            total_score?: number;
            updated_at?: string | null;
            user_id: string;
          };
          Update: {
            correct_answers?: number;
            created_at?: string | null;
            highest_score?: number;
            last_match_date?: string | null;
            matches_played?: number;
            matches_won?: number;
            questions_answered?: number;
            total_score?: number;
            updated_at?: string | null;
            user_id?: string;
          };
          Relationships: [];
        };
        flashcards: {
          Row: {
            answer: string;
            consecutive_correct_answers: number | null;
            created_at: string;
            easiness_factor: number | null;
            id: string;
            last_reviewed_at: string | null;
            next_review_at: string | null;
            question: string;
            updated_at: string;
            upload_id: string | null;
            user_id: string;
          };
          Insert: {
            answer: string;
            consecutive_correct_answers?: number | null;
            created_at?: string;
            easiness_factor?: number | null;
            id?: string;
            last_reviewed_at?: string | null;
            next_review_at?: string | null;
            question: string;
            updated_at?: string;
            upload_id?: string | null;
            user_id: string;
          };
          Update: {
            answer?: string;
            consecutive_correct_answers?: number | null;
            created_at?: string;
            easiness_factor?: number | null;
            id?: string;
            last_reviewed_at?: string | null;
            next_review_at?: string | null;
            question?: string;
            updated_at?: string;
            upload_id?: string | null;
            user_id?: string;
          };
          Relationships: [
            {
              foreignKeyName: "flashcards_upload_id_fkey";
              columns: ["upload_id"];
              isOneToOne: false;
              referencedRelation: "ocr_uploads";
              referencedColumns: ["id"];
            }
          ];
        };
        match_players: {
          Row: {
            correct_answers: number;
            created_at: string | null;
            id: string;
            match_id: string;
            questions_answered: number;
            score: number;
            updated_at: string | null;
            user_id: string;
          };
          Insert: {
            correct_answers?: number;
            created_at?: string | null;
            id?: string;
            match_id: string;
            questions_answered?: number;
            score?: number;
            updated_at?: string | null;
            user_id: string;
          };
          Update: {
            correct_answers?: number;
            created_at?: string | null;
            id?: string;
            match_id?: string;
            questions_answered?: number;
            score?: number;
            updated_at?: string | null;
            user_id?: string;
          };
          Relationships: [
            {
              foreignKeyName: "match_players_match_id_fkey";
              columns: ["match_id"];
              isOneToOne: false;
              referencedRelation: "arena_matches";
              referencedColumns: ["id"];
            }
          ];
        };
        ocr_uploads: {
          Row: {
            created_at: string;
            error_message: string | null;
            id: string;
            image_url: string;
            status: "pending" | "processing" | "completed" | "error";
            updated_at: string;
            user_id: string;
          };
          Insert: {
            created_at?: string;
            error_message?: string | null;
            id?: string;
            image_url: string;
            status?: "pending" | "processing" | "completed" | "error";
            updated_at?: string;
            user_id: string;
          };
          Update: {
            created_at?: string;
            error_message?: string | null;
            id?: string;
            image_url?: string;
            status?: "pending" | "processing" | "completed" | "error";
            updated_at?: string;
            user_id?: string;
          };
          Relationships: [];
        };
        profiles: {
          Row: {
            avatar_url: string | null;
            bio: string | null;
            created_at: string | null;
            full_name: string | null;
            id: string;
            learning_preferences: any | null;
            updated_at: string | null;
          };
          Insert: {
            avatar_url?: string | null;
            bio?: string | null;
            created_at?: string | null;
            full_name?: string | null;
            id: string;
            learning_preferences?: any | null;
            updated_at?: string | null;
          };
          Update: {
            avatar_url?: string | null;
            bio?: string | null;
            created_at?: string | null;
            full_name?: string | null;
            id?: string;
            learning_preferences?: any | null;
            updated_at?: string | null;
          };
          Relationships: [];
        };
        quiz_questions: {
          Row: {
            category: string;
            correct_answer: string;
            created_at: string | null;
            difficulty: string;
            id: string;
            option_a: string;
            option_b: string;
            option_c: string;
            option_d: string;
            question: string;
            updated_at: string | null;
          };
          Insert: {
            category: string;
            correct_answer: string;
            created_at?: string | null;
            difficulty: string;
            id?: string;
            option_a: string;
            option_b: string;
            option_c: string;
            option_d: string;
            question: string;
            updated_at?: string | null;
          };
          Update: {
            category?: string;
            correct_answer?: string;
            created_at?: string | null;
            difficulty?: string;
            id?: string;
            option_a?: string;
            option_b?: string;
            option_c?: string;
            option_d?: string;
            question?: string;
            updated_at?: string | null;
          };
          Relationships: [];
        };
        user_achievements: {
          Row: {
            achievement_id: string;
            earned_at: string | null;
            id: string;
            user_id: string;
          };
          Insert: {
            achievement_id: string;
            earned_at?: string | null;
            id?: string;
            user_id: string;
          };
          Update: {
            achievement_id?: string;
            earned_at?: string | null;
            id?: string;
            user_id?: string;
          };
          Relationships: [];
        };
      };
      Views: {};
      Functions: {
        update_player_progress: {
          Args: {
            match_id_param: string;
            user_id_param: string;
            score_to_add: number;
            is_correct: boolean;
          };
          Returns: undefined;
        };
      };
      Enums: {
        processing_status: "pending" | "processing" | "completed" | "error";
      };
      CompositeTypes: {};
    };
  }
}
