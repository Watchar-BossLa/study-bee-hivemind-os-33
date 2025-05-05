
-- Create chat message tables
CREATE TABLE IF NOT EXISTS public.arena_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.arena_matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create typing status table
CREATE TABLE IF NOT EXISTS public.arena_typing_status (
  user_id UUID NOT NULL,
  match_id UUID NOT NULL REFERENCES public.arena_matches(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT FALSE NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, match_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_match_id ON arena_chat_messages(match_id);
CREATE INDEX IF NOT EXISTS idx_typing_status_match_id ON arena_typing_status(match_id);

-- RLS policies for arena_chat_messages
ALTER TABLE public.arena_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to insert their own messages" 
  ON public.arena_chat_messages 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to read all messages" 
  ON public.arena_chat_messages 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- RLS policies for arena_typing_status
ALTER TABLE public.arena_typing_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to update their own typing status" 
  ON public.arena_typing_status 
  FOR ALL 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to read all typing statuses" 
  ON public.arena_typing_status 
  FOR SELECT 
  TO authenticated 
  USING (true);
