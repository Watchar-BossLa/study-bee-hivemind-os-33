
import { Course, LearningPath } from '../types/learning';

// Related courses data
export const relatedCourses: Course[] = [
  { id: '1', topic: 'Mitochondria', course: 'Cell Biology 101' },
  { id: '2', topic: 'ATP', course: 'Biochemistry Fundamentals' },
  { id: '3', topic: 'Cellular Respiration', course: 'Energy in Biology' },
  { id: '4', topic: 'DNA', course: 'Introduction to Genetics' },
  { id: '5', topic: 'Krebs Cycle', course: 'Advanced Metabolism' },
  { id: '6', topic: 'Evolution', course: 'Evolutionary Biology' },
  { id: '7', topic: 'Natural Selection', course: "Darwin's Theory" },
];

// Learning paths
export const learningPaths: LearningPath[] = [
  { 
    name: 'Cell Biology Track', 
    topics: ['Cell Biology', 'Mitochondria', 'ATP', 'Cellular Respiration']
  },
  { 
    name: 'Genetics Track', 
    topics: ['Genetics', 'DNA', 'RNA', 'Protein Synthesis']
  },
  { 
    name: 'Evolution Track', 
    topics: ['Evolution', 'Natural Selection', 'Genetics']
  },
];
