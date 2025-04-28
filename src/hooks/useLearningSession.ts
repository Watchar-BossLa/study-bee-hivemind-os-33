
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useLearningSession = (subjectId?: string, moduleId?: string, courseId?: string) => {
  useEffect(() => {
    const startSession = async () => {
      if (!subjectId || !moduleId || !courseId) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: user.id,
          subject_id: subjectId,
          module_id: moduleId,
          course_id: courseId,
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting learning session:', error);
      }
    };

    startSession();

    return () => {
      const endSession = async () => {
        if (!subjectId || !moduleId || !courseId) return;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: sessions } = await supabase
          .from('learning_sessions')
          .select('id, start_time')
          .eq('subject_id', subjectId)
          .eq('module_id', moduleId)
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .is('end_time', null)
          .limit(1)
          .maybeSingle();

        if (sessions) {
          const endTime = new Date();
          const startTime = new Date(sessions.start_time);
          const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

          await supabase
            .from('learning_sessions')
            .update({
              end_time: endTime.toISOString(),
              duration_minutes: durationMinutes,
            })
            .eq('id', sessions.id);

          const today = new Date().toISOString().split('T')[0];
          await supabase.rpc('upsert_study_metrics', {
            p_date: today,
            p_duration: durationMinutes,
            p_sessions: 1,
          });
        }
      };

      endSession();
    };
  }, [subjectId, moduleId, courseId]);
};
