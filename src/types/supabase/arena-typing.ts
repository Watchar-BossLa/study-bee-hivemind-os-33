
// This file contains types for the arena typing status table
import type { Database } from '@/integrations/supabase/types';

export interface ArenaTypingStatusTable {
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
}

export type TypingStatus = ArenaTypingStatusTable['Row'];
