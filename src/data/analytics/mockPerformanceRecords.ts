
import type { PerformanceRecord } from '@/types/analytics';

export const MOCK_PERFORMANCE_RECORDS: PerformanceRecord[] = [
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
