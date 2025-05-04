
-- Create question_answers table to track user answers
CREATE TABLE IF NOT EXISTS public.question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time FLOAT NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add index to help with query performance
CREATE INDEX IF NOT EXISTS idx_question_answers_user_id ON public.question_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_question_answers_question_id ON public.question_answers(question_id);

-- Add RLS policies for the question_answers table
ALTER TABLE public.question_answers ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to insert their own answers
CREATE POLICY insert_own_answers
  ON public.question_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow authenticated users to select their own answers
CREATE POLICY select_own_answers
  ON public.question_answers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Update the arena_matches table to add subject_focus column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'arena_matches' 
    AND column_name = 'subject_focus'
  ) THEN
    ALTER TABLE public.arena_matches ADD COLUMN subject_focus TEXT;
  END IF;
END
$$;

-- Update match_players table to add streak and total_response_time columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'match_players' 
    AND column_name = 'streak'
  ) THEN
    ALTER TABLE public.match_players ADD COLUMN streak INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'match_players' 
    AND column_name = 'total_response_time'
  ) THEN
    ALTER TABLE public.match_players ADD COLUMN total_response_time FLOAT DEFAULT 0;
  END IF;
END
$$;

-- Update the update_player_progress function to handle response_time_param
CREATE OR REPLACE FUNCTION update_player_progress(
  match_id_param UUID,
  user_id_param UUID,
  score_to_add INTEGER,
  is_correct BOOLEAN,
  response_time_param FLOAT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  current_streak INTEGER;
  current_player_record RECORD;
BEGIN
  -- Get current player data
  SELECT * INTO current_player_record 
  FROM match_players 
  WHERE match_id = match_id_param AND user_id = user_id_param;
  
  -- Update streak based on correctness
  IF current_player_record.streak IS NULL THEN
    current_streak := 0;
  ELSE
    current_streak := current_player_record.streak;
  END IF;
  
  IF is_correct THEN
    current_streak := current_streak + 1;
  ELSE
    current_streak := 0;
  END IF;
  
  -- Update player record
  UPDATE match_players
  SET 
    score = COALESCE(score, 0) + score_to_add,
    questions_answered = COALESCE(questions_answered, 0) + 1,
    correct_answers = CASE WHEN is_correct THEN COALESCE(correct_answers, 0) + 1 ELSE COALESCE(correct_answers, 0) END,
    total_response_time = CASE 
      WHEN response_time_param IS NOT NULL THEN COALESCE(total_response_time, 0) + response_time_param 
      ELSE COALESCE(total_response_time, 0)
    END,
    streak = current_streak
  WHERE match_id = match_id_param AND user_id = user_id_param;
  
  -- Also update arena_stats
  IF EXISTS (SELECT 1 FROM arena_stats WHERE user_id = user_id_param) THEN
    UPDATE arena_stats
    SET
      total_score = total_score + score_to_add,
      questions_answered = questions_answered + 1,
      correct_answers = CASE WHEN is_correct THEN correct_answers + 1 ELSE correct_answers END,
      highest_score = GREATEST(highest_score, (SELECT score FROM match_players WHERE match_id = match_id_param AND user_id = user_id_param))
    WHERE user_id = user_id_param;
  ELSE
    INSERT INTO arena_stats (
      user_id,
      total_score,
      questions_answered,
      correct_answers,
      highest_score,
      matches_played,
      matches_won
    )
    VALUES (
      user_id_param,
      score_to_add,
      1,
      CASE WHEN is_correct THEN 1 ELSE 0 END,
      score_to_add,
      1,
      0
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
