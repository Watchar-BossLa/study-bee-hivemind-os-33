
/**
 * This file extends the Supabase database types with our custom tables
 */
import { Database as OriginalDatabase } from '@/integrations/supabase/types';

// Define the custom tables that are not in the generated types
interface CustomTables {
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

// Use declaration merging to extend the original Database interface
declare module '@/integrations/supabase/types' {
  interface Database extends OriginalDatabase {
    public: {
      Tables: OriginalDatabase['public']['Tables'] & CustomTables;
      Views: OriginalDatabase['public']['Views'];
      Functions: OriginalDatabase['public']['Functions'];
      Enums: OriginalDatabase['public']['Enums'];
      CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
    };
  }
}
