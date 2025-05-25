
import { SpecializedAgent } from '../../types/agents';

export const domainSpecializedAgents: SpecializedAgent[] = [
  {
    id: 'math-specialist',
    name: 'MathSpecialistGPT',
    type: 'specialized',
    role: 'Mathematics Expert',
    capabilities: ['math-problem-solving', 'concept-explanation', 'formula-derivation'],
    status: 'active',
    domain: 'Mathematics',
    expertise: ['algebra', 'calculus', 'statistics', 'geometry', 'number-theory'],
    specialization: ['algebra', 'calculus'],
    performance: { accuracy: 0.97, responseTime: 900, userFeedback: 4.8 },
    specializationDepth: 0.95,
    adaptability: 0.6,
    collaborationScore: 0.8,
    createdAt: new Date()
  },
  {
    id: 'science-specialist',
    name: 'ScienceSpecialistGPT',
    type: 'specialized',
    role: 'Science Expert',
    capabilities: ['scientific-explanation', 'experiment-design', 'hypothesis-testing'],
    status: 'active',
    domain: 'Science',
    expertise: ['biology', 'chemistry', 'physics', 'astronomy', 'earth-science'],
    specialization: ['biology', 'chemistry'],
    performance: { accuracy: 0.96, responseTime: 950, userFeedback: 4.7 },
    specializationDepth: 0.9,
    adaptability: 0.7,
    collaborationScore: 0.85,
    createdAt: new Date()
  },
  {
    id: 'humanities-specialist',
    name: 'HumanitiesSpecialistGPT',
    type: 'specialized',
    role: 'Humanities Expert',
    capabilities: ['critical-analysis', 'contextual-understanding', 'interdisciplinary-connections'],
    status: 'active',
    domain: 'Humanities',
    expertise: ['literature', 'history', 'philosophy', 'art-history', 'cultural-studies'],
    specialization: ['literature', 'history'],
    performance: { accuracy: 0.93, responseTime: 850, userFeedback: 4.8 },
    specializationDepth: 0.88,
    adaptability: 0.8,
    collaborationScore: 0.9,
    createdAt: new Date()
  }
];
