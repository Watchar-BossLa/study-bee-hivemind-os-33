
import { SpecializedAgent } from '../types/agents';

// Base specialized agents
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

// New specialized domain agents
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

// Meta-learning agents
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

// Combine all specialized agents
export const allSpecializedAgents: SpecializedAgent[] = [
  ...baseSpecializedAgents,
  ...domainSpecializedAgents,
  ...metaLearningAgents
];

// Function to get agents by domain
export function getAgentsByDomain(domain: string): SpecializedAgent[] {
  return allSpecializedAgents.filter(agent => 
    agent.domain.toLowerCase() === domain.toLowerCase() || 
    agent.expertise.some(exp => exp.toLowerCase().includes(domain.toLowerCase()))
  );
}

// Function to get the most suitable agents for a specific topic
export function getAgentsForTopic(topic: string, count: number = 3): SpecializedAgent[] {
  const scoredAgents = allSpecializedAgents.map(agent => {
    let score = 0;
    
    // Check if the agent has direct expertise in the topic
    const hasDirectExpertise = agent.expertise.some(exp => 
      topic.toLowerCase().includes(exp.toLowerCase()) || 
      exp.toLowerCase().includes(topic.toLowerCase())
    );
    
    if (hasDirectExpertise) score += 5;
    
    // Consider domain relevance
    if (topic.toLowerCase().includes(agent.domain.toLowerCase()) ||
        agent.domain.toLowerCase().includes(topic.toLowerCase())) {
      score += 3;
    }
    
    // Consider agent adaptability for topics outside their direct expertise
    if (!hasDirectExpertise) {
      score += (agent.adaptability || 0.5) * 2;
    }
    
    // Consider specialized depth for complex topics
    score += (agent.specializationDepth || 0.5) * 2;
    
    return { agent, score };
  });
  
  // Sort by score and take the top 'count' agents
  return scoredAgents
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.agent);
}
