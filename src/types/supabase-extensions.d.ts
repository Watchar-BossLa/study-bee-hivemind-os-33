
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
      };
    };
  }
}
