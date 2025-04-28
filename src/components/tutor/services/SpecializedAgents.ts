
import { SpecializedAgent } from '../types/agents';

// Base specialized agents
export const baseSpecializedAgents: SpecializedAgent[] = [
  {
    id: 'content-expert',
    name: 'ContentExpertGPT',
    role: 'Content Expert',
    capabilities: ['knowledge-validation', 'fact-checking', 'content-creation'],
    status: 'idle',
    domain: 'Subject Matter',
    expertise: ['curriculum-alignment', 'academic-standards', 'content-accuracy'],
    performance: { accuracy: 0.95, responseTime: 1200, userFeedback: 4.8 },
    adaptability: 0.8,
    collaborationScore: 0.85
  },
  {
    id: 'learning-strategist',
    name: 'LearningStrategistGPT',
    role: 'Learning Strategist',
    capabilities: ['learning-path-design', 'difficulty-assessment', 'prerequisite-analysis'],
    status: 'idle',
    domain: 'Pedagogy',
    expertise: ['learning-theory', 'cognitive-load', 'scaffolding'],
    performance: { accuracy: 0.92, responseTime: 800, userFeedback: 4.7 },
    adaptability: 0.75,
    collaborationScore: 0.9
  },
  {
    id: 'engagement-specialist',
    name: 'EngagementSpecialistGPT',
    role: 'Engagement Specialist',
    capabilities: ['motivation-analysis', 'engagement-tactics', 'feedback-optimization'],
    status: 'idle',
    domain: 'User Experience',
    expertise: ['gamification', 'reinforcement', 'flow-state'],
    performance: { accuracy: 0.89, responseTime: 600, userFeedback: 4.9 },
    adaptability: 0.9,
    collaborationScore: 0.8
  },
  {
    id: 'assessment-expert',
    name: 'AssessmentExpertGPT',
    role: 'Assessment Expert',
    capabilities: ['question-generation', 'answer-validation', 'difficulty-calibration'],
    status: 'idle',
    domain: 'Evaluation',
    expertise: ['bloom-taxonomy', 'assessment-design', 'knowledge-testing'],
    performance: { accuracy: 0.94, responseTime: 900, userFeedback: 4.6 },
    adaptability: 0.7,
    collaborationScore: 0.75
  }
];

// New specialized domain agents
export const domainSpecializedAgents: SpecializedAgent[] = [
  {
    id: 'math-specialist',
    name: 'MathSpecialistGPT',
    role: 'Mathematics Expert',
    capabilities: ['math-problem-solving', 'concept-explanation', 'formula-derivation'],
    status: 'idle',
    domain: 'Mathematics',
    expertise: ['algebra', 'calculus', 'statistics', 'geometry', 'number-theory'],
    performance: { accuracy: 0.97, responseTime: 900, userFeedback: 4.8 },
    specializationDepth: 0.95,
    adaptability: 0.6,
    collaborationScore: 0.8
  },
  {
    id: 'science-specialist',
    name: 'ScienceSpecialistGPT',
    role: 'Science Expert',
    capabilities: ['scientific-explanation', 'experiment-design', 'hypothesis-testing'],
    status: 'idle',
    domain: 'Science',
    expertise: ['biology', 'chemistry', 'physics', 'astronomy', 'earth-science'],
    performance: { accuracy: 0.96, responseTime: 950, userFeedback: 4.7 },
    specializationDepth: 0.9,
    adaptability: 0.7,
    collaborationScore: 0.85
  },
  {
    id: 'humanities-specialist',
    name: 'HumanitiesSpecialistGPT',
    role: 'Humanities Expert',
    capabilities: ['critical-analysis', 'contextual-understanding', 'interdisciplinary-connections'],
    status: 'idle',
    domain: 'Humanities',
    expertise: ['literature', 'history', 'philosophy', 'art-history', 'cultural-studies'],
    performance: { accuracy: 0.93, responseTime: 850, userFeedback: 4.8 },
    specializationDepth: 0.88,
    adaptability: 0.8,
    collaborationScore: 0.9
  }
];

// Meta-learning agents
export const metaLearningAgents: SpecializedAgent[] = [
  {
    id: 'metacognition-coach',
    name: 'MetacognitionCoachGPT',
    role: 'Learning Coach',
    capabilities: ['learning-strategy-optimization', 'study-habit-analysis', 'cognitive-bias-detection'],
    status: 'idle',
    domain: 'Meta Learning',
    expertise: ['metacognition', 'self-regulation', 'learning-psychology', 'habit-formation'],
    performance: { accuracy: 0.91, responseTime: 700, userFeedback: 4.9 },
    adaptability: 0.95,
    collaborationScore: 0.95
  },
  {
    id: 'progress-analyst',
    name: 'ProgressAnalystGPT',
    role: 'Progress Analyst',
    capabilities: ['learning-analytics', 'progress-tracking', 'adaptive-recommendations'],
    status: 'idle',
    domain: 'Analytics',
    expertise: ['data-analysis', 'learning-patterns', 'progress-visualization', 'prediction-models'],
    performance: { accuracy: 0.94, responseTime: 650, userFeedback: 4.7 },
    adaptability: 0.85,
    collaborationScore: 0.8
  },
  {
    id: 'collaboration-facilitator',
    name: 'PeerCollaborationGPT',
    role: 'Collaboration Facilitator',
    capabilities: ['group-dynamics-optimization', 'peer-learning-facilitation', 'collaborative-project-guidance'],
    status: 'idle',
    domain: 'Collaborative Learning',
    expertise: ['group-dynamics', 'peer-teaching', 'collaborative-knowledge-building', 'social-learning'],
    performance: { accuracy: 0.9, responseTime: 750, userFeedback: 4.8 },
    adaptability: 0.9,
    collaborationScore: 0.98
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
