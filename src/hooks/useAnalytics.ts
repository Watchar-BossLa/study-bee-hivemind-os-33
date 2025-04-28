
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StudyMetrics {
  id: string;
  user_id: string;
  total_study_time_minutes: number;
  sessions_completed: number;
  focus_score: number;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface PerformanceRecord {
  id: string;
  user_id: string;
  subject_id: string;
  score: number;
  assessment_type: string;
  completed_at: string;
  created_at?: string;
}

export function useAnalytics() {
  const { data: studyMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['study-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data as StudyMetrics[];
    },
  });

  const { data: performanceRecords, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['performance-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_records')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as PerformanceRecord[];
    },
  });

  return {
    studyMetrics,
    performanceRecords,
    isLoading: isLoadingMetrics || isLoadingPerformance,
  };
}
