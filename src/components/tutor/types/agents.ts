
export type AgentStatus = 'active' | 'inactive' | 'busy' | 'idle';
export type AgentType = 'specialized' | 'general' | 'coordinator';

export interface AgentPerformanceMetrics {
  overallAccuracy: number;
  userFeedbackAverage: number;
  responseTimeAverage: number;
  domainSpecificPerformance: Record<string, number>;
  topicPerformance: Record<string, number>;
  improvementRate: number;
  lastUpdated: Date;
}

export interface AgentPerformance {
  accuracy: number;
  responseTime: number;
  userFeedback: number;
}

export interface UserInteraction {
  id: string;
  userId: string;
  agentId: string;
  message: string;
  response: string;
  timestamp: Date;
  satisfaction?: number;
  metadata?: Record<string, any>;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  prerequisites?: string[];
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  costPerToken: number;
  maxTokens: number;
  capabilities: string[];
  isActive: boolean;
  isAvailable: boolean;
  latency: 'low' | 'medium' | 'high';
}

export interface SpecializedAgent {
  id: string;
  name: string;
  type: AgentType;
  role: string;
  capabilities: string[];
  status: AgentStatus;
  domain: string;
  expertise: string[];
  specialization: string[];
  performance: AgentPerformance;
  adaptability: number;
  collaborationScore: number;
  specializationDepth?: number;
  createdAt: Date;
  performanceHistory?: {
    successRate: number;
    averageResponseTime: number;
    lastUsed: Date;
  };
}

export interface Council {
  id: string;
  name: string;
  topic: string;
  agents: SpecializedAgent[];
  status: 'active' | 'inactive';
  createdAt: Date;
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

export interface TaskPriority {
  level: 'low' | 'normal' | 'high' | 'critical';
  weight: number;
}
