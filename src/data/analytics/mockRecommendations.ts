
import type { StudyRecommendation } from '@/types/analytics';

// New mock data for enhanced analytics
export const MOCK_STUDY_RECOMMENDATIONS: StudyRecommendation[] = [
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
