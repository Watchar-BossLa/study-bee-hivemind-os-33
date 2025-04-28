
CREATE OR REPLACE FUNCTION public.upsert_study_metrics(
  p_date date,
  p_duration integer,
  p_sessions integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.study_metrics (
    user_id,
    date,
    total_study_time_minutes,
    sessions_completed,
    focus_score
  )
  VALUES (
    auth.uid(),
    p_date,
    p_duration,
    p_sessions,
    LEAST(100, p_duration::float / 60 * 100) -- Simple focus score calculation
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_study_time_minutes = study_metrics.total_study_time_minutes + p_duration,
    sessions_completed = study_metrics.sessions_completed + p_sessions,
    focus_score = LEAST(100, (study_metrics.total_study_time_minutes + p_duration)::float / 60 * 100);
END;
$$;
