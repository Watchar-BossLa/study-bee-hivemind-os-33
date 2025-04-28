
import { useQuery } from '@tanstack/react-query';

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

// Mock data for development until backend is ready
const MOCK_STUDY_METRICS: StudyMetrics[] = [
  {
    id: '1',
    user_id: 'user-1',
    total_study_time_minutes: 120,
    sessions_completed: 2,
    focus_score: 85,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: '2',
    user_id: 'user-1',
    total_study_time_minutes: 90,
    sessions_completed: 1,
    focus_score: 75,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: '3',
    user_id: 'user-1',
    total_study_time_minutes: 180,
    sessions_completed: 3,
    focus_score: 90,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: '4',
    user_id: 'user-1',
    total_study_time_minutes: 60,
    sessions_completed: 1,
    focus_score: 65,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: '5',
    user_id: 'user-1',
    total_study_time_minutes: 150,
    sessions_completed: 2,
    focus_score: 88,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    id: '6',
    user_id: 'user-1',
    total_study_time_minutes: 210,
    sessions_completed: 3,
    focus_score: 95,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
];

const MOCK_PERFORMANCE_RECORDS: PerformanceRecord[] = [
  {
    id: '1',
    user_id: 'user-1',
    subject_id: 'biology',
    score: 85,
    assessment_type: 'quiz',
    completed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    subject_id: 'math',
    score: 92,
    assessment_type: 'test',
    completed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    subject_id: 'biology',
    score: 78,
    assessment_type: 'quiz',
    completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    user_id: 'user-1',
    subject_id: 'physics',
    score: 88,
    assessment_type: 'test',
    completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    user_id: 'user-1',
    subject_id: 'math',
    score: 95,
    assessment_type: 'test',
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function useAnalytics() {
  const { data: studyMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['study-metrics'],
    queryFn: async () => {
      console.log('Fetching study metrics (using mock data for now)');
      // Using mock data until database tables are fully set up
      return MOCK_STUDY_METRICS;
    },
  });

  const { data: performanceRecords, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['performance-records'],
    queryFn: async () => {
      console.log('Fetching performance records (using mock data for now)');
      // Using mock data until database tables are fully set up
      return MOCK_PERFORMANCE_RECORDS;
    },
  });

  return {
    studyMetrics,
    performanceRecords,
    isLoading: isLoadingMetrics || isLoadingPerformance,
  };
}
