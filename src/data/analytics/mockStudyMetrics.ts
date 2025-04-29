
import type { StudyMetrics } from '@/types/analytics';

// Mock data for development until backend is ready
export const MOCK_STUDY_METRICS: StudyMetrics[] = [
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
