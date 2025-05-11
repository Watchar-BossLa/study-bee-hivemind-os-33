
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

// Modify Database type definition through declaration merging
declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        arena_matches: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
          Relationships: [];
        };
        arena_stats: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
          Relationships: [];
        };
        flashcards: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
          Relationships: [];
        };
        match_players: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
          Relationships: [];
        };
        ocr_uploads: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
          Relationships: [];
        };
        profiles: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
          Relationships: [];
        };
        quiz_questions: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
          Relationships: [];
        };
        user_achievements: {
          Row: { /* ... keep existing code */ };
          Insert: { /* ... keep existing code */ };
          Update: { /* ... keep existing code */ };
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
