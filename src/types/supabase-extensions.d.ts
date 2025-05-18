
// This file is used to add additional type information to the Supabase client
import { Database } from '@/integrations/supabase/types';

declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string;
            full_name: string | null;
            avatar_url: string | null;
            bio: string | null;
            created_at: string | null;
            updated_at: string | null;
            learning_preferences: Json | null;
          };
          Insert: {
            id: string;
            full_name?: string | null;
            avatar_url?: string | null;
            bio?: string | null;
            created_at?: string | null;
            updated_at?: string | null;
            learning_preferences?: Json | null;
          };
          Update: {
            id?: string;
            full_name?: string | null;
            avatar_url?: string | null;
            bio?: string | null;
            created_at?: string | null;
            updated_at?: string | null;
            learning_preferences?: Json | null;
          };
        };
        session_whiteboard_paths: {
          Row: {
            id: string;
            session_id: string;
            user_id: string;
            user_name: string;
            path_data: Json;
            color: string;
            tool: string;
            brush_size: number;
            created_at: string;
          };
        };
        live_sessions: {
          Row: {
            id: string;
            host_id: string;
            title: string;
            description: string | null;
            subject: string;
            max_participants: number;
            start_time: string;
            end_time: string | null;
            status: string;
            is_private: boolean;
            access_code: string | null;
            features: Json;
            created_at: string;
            updated_at: string;
          };
        };
        session_participants: {
          Row: {
            id: string;
            session_id: string;
            user_id: string;
            role: string;
            joined_at: string;
            left_at: string | null;
            is_active: boolean;
          };
          Relationships: {
            profiles: {
              id: string;
              full_name: string | null;
              avatar_url: string | null;
            };
          };
        };
      };
    };
  }
}
