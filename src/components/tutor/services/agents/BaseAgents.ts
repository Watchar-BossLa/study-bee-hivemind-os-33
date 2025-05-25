
import { SpecializedAgent } from '../../types/agents';

export const baseSpecializedAgents: SpecializedAgent[] = [
  {
    id: 'content-expert',
    name: 'ContentExpertGPT',
    type: 'specialized',
    role: 'Content Expert',
    capabilities: ['knowledge-validation', 'fact-checking', 'content-creation'],
    status: 'active',
    domain: 'Subject Matter',
    expertise: ['curriculum-alignment', 'academic-standards', 'content-accuracy'],
    specialization: ['curriculum-alignment', 'academic-standards'],
    performance: { accuracy: 0.95, responseTime: 1200, userFeedback: 4.8 },
    adaptability: 0.8,
    collaborationScore: 0.85,
    createdAt: new Date()
  },
  {
    id: 'learning-strategist',
    name: 'LearningStrategistGPT',
    type: 'specialized',
    role: 'Learning Strategist',
    capabilities: ['learning-path-design', 'difficulty-assessment', 'prerequisite-analysis'],
    status: 'active',
    domain: 'Pedagogy',
    expertise: ['learning-theory', 'cognitive-load', 'scaffolding'],
    specialization: ['learning-theory', 'cognitive-load'],
    performance: { accuracy: 0.92, responseTime: 800, userFeedback: 4.7 },
    adaptability: 0.75,
    collaborationScore: 0.9,
    createdAt: new Date()
  },
  {
    id: 'engagement-specialist',
    name: 'EngagementSpecialistGPT',
    type: 'specialized',
    role: 'Engagement Specialist',
    capabilities: ['motivation-analysis', 'engagement-tactics', 'feedback-optimization'],
    status: 'active',
    domain: 'User Experience',
    expertise: ['gamification', 'reinforcement', 'flow-state'],
    specialization: ['gamification', 'reinforcement'],
    performance: { accuracy: 0.89, responseTime: 600, userFeedback: 4.9 },
    adaptability: 0.9,
    collaborationScore: 0.8,
    createdAt: new Date()
  },
  {
    id: 'assessment-expert',
    name: 'AssessmentExpertGPT',
    type: 'specialized',
    role: 'Assessment Expert',
    capabilities: ['question-generation', 'answer-validation', 'difficulty-calibration'],
    status: 'active',
    domain: 'Evaluation',
    expertise: ['bloom-taxonomy', 'assessment-design', 'knowledge-testing'],
    specialization: ['bloom-taxonomy', 'assessment-design'],
    performance: { accuracy: 0.94, responseTime: 900, userFeedback: 4.6 },
    adaptability: 0.7,
    collaborationScore: 0.75,
    createdAt: new Date()
  }
];
