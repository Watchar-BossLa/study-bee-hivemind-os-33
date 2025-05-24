
export interface Agent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'busy' | 'idle';
  createdAt: Date;
}

export interface BaseAgent extends Agent {
  role: string;
}

export interface SpecializedAgent extends Agent {
  role: string;
  domain: string;
  expertise: string[];
  performance: {
    accuracy: number;
    responseTime: number;
    userFeedback: number;
  };
  specializationDepth?: number;
  adaptability?: number;
  collaborationScore?: number;
}

export interface AgentPerformanceMetrics {
  overallAccuracy: number;
  userFeedbackAverage: number;
  responseTimeAverage: number;
  domainSpecificPerformance: Record<string, number>;
  topicPerformance: Record<string, number>;
  improvementRate: number;
  lastUpdated: Date;
}

export interface Council {
  id: string;
  name: string;
  topic: string;
  agents: SpecializedAgent[];
  createdAt: Date;
  isActive: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: Record<string, any>;
  loading?: boolean;
}

export interface UserInteraction {
  id: string;
  userId: string;
  sessionId: string;
  query: string;
  response: string;
  agentIds: string[];
  timestamp: Date;
  feedbackRating?: number;
  contextData?: Record<string, any>;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  costPerToken: number;
  maxTokens: number;
  capabilities: string[];
  isActive: boolean;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    type: 'lesson' | 'quiz' | 'exercise';
    estimatedDuration: number;
  }>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  createdAt: Date;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: number;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    estimatedTime: number;
  }>;
  status: 'draft' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  createdBy: string;
}

export interface DeliberationResult {
  id: string;
  topic: string;
  consensusResponse: string;
  confidence: number;
  participatingAgents: string[];
  votes: Array<{
    agentId: string;
    vote: 'approve' | 'reject' | 'abstain';
    reasoning: string;
  }>;
  recommendations: string[];
  timestamp: Date;
}
