
import type { WeakAreaRecommendation } from '@/types/analytics';

export const MOCK_WEAK_AREAS: WeakAreaRecommendation[] = [
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
