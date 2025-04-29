import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  StudyMetrics, 
  PerformanceRecord, 
  StudyRecommendation, 
  FocusInterval,
  SubjectProgress,
  WeakAreaRecommendation
} from '@/types/analytics';

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

// New mock data for enhanced analytics
const MOCK_STUDY_RECOMMENDATIONS: StudyRecommendation[] = [
  {
    id: '1',
    subject: 'Biology',
    reason: 'Your test scores indicate need for improvement',
    priority: 'high',
    recommended_time_minutes: 60,
    suggested_resources: ['Cell Structure Flashcards', 'Khan Academy Biology Videos']
  },
  {
    id: '2',
    subject: 'Mathematics',
    reason: 'Keep up the momentum from your recent high scores',
    priority: 'medium',
    recommended_time_minutes: 45,
    suggested_resources: ['Calculus Quiz Set', 'Practice Problems PDF']
  },
  {
    id: '3',
    subject: 'Physics',
    reason: 'You haven\'t studied this in over a week',
    priority: 'low',
    recommended_time_minutes: 30,
    suggested_resources: ['Force and Motion Interactive Demo', 'Physics Lab Review']
  }
];

const MOCK_FOCUS_INTERVALS: FocusInterval[] = [
  { date: '2023-04-25', hour: 9, productivity_score: 85 },
  { date: '2023-04-25', hour: 10, productivity_score: 92 },
  { date: '2023-04-25', hour: 13, productivity_score: 65 },
  { date: '2023-04-25', hour: 14, productivity_score: 78 },
  { date: '2023-04-25', hour: 19, productivity_score: 88 },
  { date: '2023-04-25', hour: 20, productivity_score: 90 },
  { date: '2023-04-26', hour: 9, productivity_score: 80 },
  { date: '2023-04-26', hour: 10, productivity_score: 85 },
  { date: '2023-04-26', hour: 14, productivity_score: 75 },
  { date: '2023-04-26', hour: 15, productivity_score: 70 },
  { date: '2023-04-26', hour: 18, productivity_score: 95 },
  { date: '2023-04-26', hour: 19, productivity_score: 90 }
];

const MOCK_SUBJECT_PROGRESS: SubjectProgress[] = [
  {
    subject_id: 'biology',
    subject_name: 'Biology',
    completion_percentage: 65,
    mastery_level: 'intermediate',
    last_studied: '2023-04-26',
    weak_areas: ['Cell Division', 'Genetics'],
    strong_areas: ['Anatomy', 'Cell Structure']
  },
  {
    subject_id: 'math',
    subject_name: 'Mathematics',
    completion_percentage: 78,
    mastery_level: 'advanced',
    last_studied: '2023-04-25',
    weak_areas: ['Differential Equations'],
    strong_areas: ['Calculus', 'Algebra', 'Statistics']
  },
  {
    subject_id: 'physics',
    subject_name: 'Physics',
    completion_percentage: 42,
    mastery_level: 'beginner',
    last_studied: '2023-04-20',
    weak_areas: ['Electromagnetism', 'Quantum Physics', 'Thermodynamics'],
    strong_areas: ['Mechanics']
  }
];

const MOCK_WEAK_AREAS: WeakAreaRecommendation[] = [
  {
    topic: 'Cell Division',
    subject_id: 'biology',
    priority: 'high',
    recommended_resources: [
      { id: '1', title: 'Cell Division Interactive Tutorial', type: 'video' },
      { id: '2', title: 'Mitosis vs Meiosis Quiz', type: 'quiz' }
    ]
  },
  {
    topic: 'Differential Equations',
    subject_id: 'math',
    priority: 'medium',
    recommended_resources: [
      { id: '3', title: 'Differential Equations Explained', type: 'video' },
      { id: '4', title: 'Practice Problems Set', type: 'article' }
    ]
  },
  {
    topic: 'Electromagnetism',
    subject_id: 'physics',
    priority: 'high',
    recommended_resources: [
      { id: '5', title: 'Electromagnetic Field Simulation', type: 'video' },
      { id: '6', title: 'Practice Questions', type: 'quiz' }
    ]
  }
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

  const { data: studyRecommendations, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['study-recommendations'],
    queryFn: async () => {
      console.log('Fetching study recommendations (using mock data for now)');
      return MOCK_STUDY_RECOMMENDATIONS;
    },
  });

  const { data: focusIntervals, isLoading: isLoadingFocusIntervals } = useQuery({
    queryKey: ['focus-intervals'],
    queryFn: async () => {
      console.log('Fetching focus intervals (using mock data for now)');
      return MOCK_FOCUS_INTERVALS;
    },
  });

  const { data: subjectProgress, isLoading: isLoadingSubjectProgress } = useQuery({
    queryKey: ['subject-progress'],
    queryFn: async () => {
      console.log('Fetching subject progress (using mock data for now)');
      return MOCK_SUBJECT_PROGRESS;
    },
  });

  const { data: weakAreaRecommendations, isLoading: isLoadingWeakAreas } = useQuery({
    queryKey: ['weak-area-recommendations'],
    queryFn: async () => {
      console.log('Fetching weak area recommendations (using mock data for now)');
      return MOCK_WEAK_AREAS;
    },
  });

  return {
    studyMetrics,
    performanceRecords,
    studyRecommendations,
    focusIntervals,
    subjectProgress,
    weakAreaRecommendations,
    isLoading: isLoadingMetrics || 
               isLoadingPerformance || 
               isLoadingRecommendations || 
               isLoadingFocusIntervals || 
               isLoadingSubjectProgress ||
               isLoadingWeakAreas,
  };
}
