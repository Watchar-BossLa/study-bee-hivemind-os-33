
// This file contains types for the arena chat messages table
import type { Database } from '@/integrations/supabase/types';

export interface ArenaChatMessagesTable {
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
}

export type ChatMessage = ArenaChatMessagesTable['Row'];
