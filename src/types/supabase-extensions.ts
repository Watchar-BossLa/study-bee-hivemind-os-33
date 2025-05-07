
// This file extends the Supabase database types with our custom tables

/**
 * Using module augmentation to extend the Supabase database types
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
import { Database as SupabaseBaseDatabase } from '@/integrations/supabase/types';

declare module '@/integrations/supabase/types' {
  export interface Database extends SupabaseBaseDatabase {
    public: {
      Tables: SupabaseBaseDatabase['public']['Tables'] & {
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
      Views: SupabaseBaseDatabase['public']['Views'];
      Functions: SupabaseBaseDatabase['public']['Functions'];
      Enums: SupabaseBaseDatabase['public']['Enums'];
      CompositeTypes: SupabaseBaseDatabase['public']['CompositeTypes'];
    };
  }
}
