
import { SpecializedAgent } from '../../types/agents';

export const metaLearningAgents: SpecializedAgent[] = [
  {
    id: 'metacognition-coach',
    name: 'MetacognitionCoachGPT',
    type: 'specialized',
    role: 'Learning Coach',
    capabilities: ['learning-strategy-optimization', 'study-habit-analysis', 'cognitive-bias-detection'],
    status: 'active',
    domain: 'Meta Learning',
    expertise: ['metacognition', 'self-regulation', 'learning-psychology', 'habit-formation'],
    specialization: ['metacognition', 'self-regulation'],
    performance: { accuracy: 0.91, responseTime: 700, userFeedback: 4.9 },
    adaptability: 0.95,
    collaborationScore: 0.95,
    createdAt: new Date()
  },
  {
    id: 'progress-analyst',
    name: 'ProgressAnalystGPT',
    type: 'specialized',
    role: 'Progress Analyst',
    capabilities: ['learning-analytics', 'progress-tracking', 'adaptive-recommendations'],
    status: 'active',
    domain: 'Analytics',
    expertise: ['data-analysis', 'learning-patterns', 'progress-visualization', 'prediction-models'],
    specialization: ['data-analysis', 'learning-patterns'],
    performance: { accuracy: 0.94, responseTime: 650, userFeedback: 4.7 },
    adaptability: 0.85,
    collaborationScore: 0.8,
    createdAt: new Date()
  },
  {
    id: 'collaboration-facilitator',
    name: 'PeerCollaborationGPT',
    type: 'specialized',
    role: 'Collaboration Facilitator',
    capabilities: ['group-dynamics-optimization', 'peer-learning-facilitation', 'collaborative-project-guidance'],
    status: 'active',
    domain: 'Collaborative Learning',
    expertise: ['group-dynamics', 'peer-teaching', 'collaborative-knowledge-building', 'social-learning'],
    specialization: ['group-dynamics', 'peer-teaching'],
    performance: { accuracy: 0.9, responseTime: 750, userFeedback: 4.8 },
    adaptability: 0.9,
    collaborationScore: 0.98,
    createdAt: new Date()
  }
];
