
import type { SubjectProgress } from '@/types/analytics';

export const MOCK_SUBJECT_PROGRESS: SubjectProgress[] = [
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
