
-- Add subject_focus column to arena_matches if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'arena_matches'
        AND column_name = 'subject_focus'
    ) THEN
        ALTER TABLE public.arena_matches ADD COLUMN subject_focus TEXT DEFAULT NULL;
    END IF;
END
$$;

-- Update RLS policies to allow authenticated users to see all arena matches
ALTER TABLE public.arena_matches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to view arena matches
CREATE POLICY IF NOT EXISTS "Allow all users to view arena matches" 
ON public.arena_matches FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow all authenticated users to create arena matches
CREATE POLICY IF NOT EXISTS "Allow all users to create arena matches" 
ON public.arena_matches FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy to allow all authenticated users to update arena matches
CREATE POLICY IF NOT EXISTS "Allow all users to update arena matches" 
ON public.arena_matches FOR UPDATE 
TO authenticated 
USING (true);

-- Create index for faster queries on subject_focus
CREATE INDEX IF NOT EXISTS idx_arena_matches_subject_focus ON public.arena_matches (subject_focus);

