
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

// Properly augment the Database type to prevent duplicate identifier error
// Using 'declare global' to ensure module augmentation doesn't conflict
declare global {
  // Use module augmentation to extend existing Database interface without redeclaring
  namespace Database {
    interface Tables {
      // Include custom tables in the interface
      arena_chat_messages: ExtendedTables['arena_chat_messages'];
      arena_typing_status: ExtendedTables['arena_typing_status'];
    }
  }
}
