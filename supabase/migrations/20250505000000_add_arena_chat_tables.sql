
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

-- Stored procedures for chat operations
-- Get chat messages for a match
CREATE OR REPLACE FUNCTION get_chat_messages(match_id_param UUID) 
RETURNS TABLE (
  id UUID,
  match_id UUID,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT acm.id, acm.match_id, acm.user_id, acm.content, acm.created_at
  FROM arena_chat_messages acm
  WHERE acm.match_id = match_id_param
  ORDER BY acm.created_at ASC
  LIMIT 100;
END;
$$;

-- Get typing status for a match
CREATE OR REPLACE FUNCTION get_typing_status(match_id_param UUID) 
RETURNS TABLE (
  user_id UUID,
  match_id UUID,
  is_typing BOOLEAN,
  last_updated TIMESTAMPTZ
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT ats.user_id, ats.match_id, ats.is_typing, ats.last_updated
  FROM arena_typing_status ats
  WHERE ats.match_id = match_id_param;
END;
$$;

-- Insert a chat message
CREATE OR REPLACE FUNCTION insert_chat_message(
  match_id_param UUID,
  user_id_param UUID,
  content_param TEXT
) 
RETURNS UUID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  new_message_id UUID;
BEGIN
  -- Verify the user exists in the match
  IF EXISTS (
    SELECT 1 FROM match_players 
    WHERE match_id = match_id_param AND user_id = user_id_param
  ) OR EXISTS (
    -- Or allow spectators (not in match) to send messages
    SELECT 1 FROM arena_matches
    WHERE id = match_id_param AND status IN ('waiting', 'active')
  ) THEN
    -- Insert the message
    INSERT INTO arena_chat_messages(match_id, user_id, content)
    VALUES (match_id_param, user_id_param, content_param)
    RETURNING id INTO new_message_id;
    
    RETURN new_message_id;
  ELSE
    RAISE EXCEPTION 'User is not allowed to send messages in this match';
  END IF;
END;
$$;

-- Update typing status
CREATE OR REPLACE FUNCTION update_typing_status(
  match_id_param UUID,
  user_id_param UUID,
  is_typing_param BOOLEAN
) 
RETURNS VOID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO arena_typing_status(match_id, user_id, is_typing, last_updated)
  VALUES (match_id_param, user_id_param, is_typing_param, now())
  ON CONFLICT (user_id, match_id)
  DO UPDATE SET 
    is_typing = is_typing_param,
    last_updated = now();
END;
$$;

-- Delete typing status
CREATE OR REPLACE FUNCTION delete_typing_status(
  match_id_param UUID,
  user_id_param UUID
) 
RETURNS VOID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM arena_typing_status
  WHERE match_id = match_id_param AND user_id = user_id_param;
END;
$$;
