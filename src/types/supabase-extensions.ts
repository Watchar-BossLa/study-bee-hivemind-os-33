
// This file extends the Supabase database types with our custom tables

// Extend the tables interface in the Database type
export interface ExtendedTables {
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
}

// Export types for use in the application
export type ChatMessage = ExtendedTables['arena_chat_messages']['Row'];
export type TypingStatus = ExtendedTables['arena_typing_status']['Row'];

// Modify Database type definition through augmentation
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
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
          Relationships: [];
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
          Relationships: [];
        };
        ocr_uploads: {
          Row: { 
            created_at: string;
            error_message: string | null;
            id: string;
            image_url: string;
            status: string;
            updated_at: string;
            user_id: string;
          };
          Insert: { 
            created_at?: string;
            error_message?: string | null;
            id?: string;
            image_url: string;
            status?: string;
            updated_at?: string;
            user_id: string;
          };
          Update: { 
            created_at?: string;
            error_message?: string | null;
            id?: string;
            image_url?: string;
            status?: string;
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
        arena_chat_messages: ExtendedTables['arena_chat_messages'];
        arena_typing_status: ExtendedTables['arena_typing_status'];
      };
      Views: { /* ... keep existing code */ };
      Functions: { /* ... keep existing code */ };
      Enums: { /* ... keep existing code */ };
      CompositeTypes: { /* ... keep existing code */ };
    }
  }
}
