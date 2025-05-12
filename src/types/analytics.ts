
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

export interface StudyRecommendation {
  id: string;
  subject: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  recommended_time_minutes: number;
  suggested_resources?: string[];
}

export interface FocusInterval {
  date: string;
  hour: number;
  productivity_score: number;
}

export interface SubjectProgress {
  subject_id: string;
  subject_name: string;
  completion_percentage: number;
  mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  last_studied: string;
  weak_areas: string[];
  strong_areas: string[];
}

export interface WeakAreaRecommendation {
  topic: string;
  subject_id: string;
  priority: 'high' | 'medium' | 'low';
  recommended_resources: Array<{
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz' | 'flashcards';
    url?: string;
  }>;
}

export interface SwarmMetric {
  id: string;
  timestamp: string;
  fanout_count: number;
  completion_time_ms: number;
  success_rate: number;
  agent_utilization: number;
  task_type: string;
  priority_level: 'low' | 'normal' | 'high' | 'critical';
}
