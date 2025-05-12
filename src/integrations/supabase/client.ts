
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Import the extensions to properly augment the types
import '@/types/supabase-extensions';

const SUPABASE_URL = "https://zhvhqpdcxgmcdoowahql.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpodmhxcGRjeGdtY2Rvb3dhaHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Njc5NjYsImV4cCI6MjA2MTI0Mzk2Nn0.yHH0jFSBqL-sCiSpVtMfTmF5OJV5SAbtpI7YCr8lyZI";

// Explicitly cast the client with the extended type information
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
