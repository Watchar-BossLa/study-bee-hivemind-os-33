
export interface BaseAgent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'error';
}

export interface LLMModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'mistral' | 'llama' | 'local';
  capabilities: string[];
  costPerToken: number;
  latency: 'low' | 'medium' | 'high';
  maxTokens: number;
  isAvailable: boolean;
}

export interface SpecializedAgent extends BaseAgent {
  domain: string;
  expertise: string[];
  performance: {
    accuracy: number;
    responseTime: number;
    userFeedback: number;
  };
  adaptability?: number; // 0-1 score for how well the agent adapts to new domains
  specializationDepth?: number; // 0-1 score for depth of specialization
  collaborationScore?: number; // 0-1 score for agent collaboration effectiveness
  performanceHistory?: {
    lastInteractions: Array<{
      timestamp: Date;
      confidenceScore: number;
      successRating?: number; // User rating if available
      topicId: string;
    }>;
  };
}

export interface CouncilVote {
  agentId: string;
  confidence: number;
  suggestion: string;
  reasoning: string;
}

export interface CouncilDecision {
  topic: string;
  votes: CouncilVote[];
  consensus: string;
  confidenceScore: number;
  timestamp: Date;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeHours: number;
  prerequisites: string[];
  recommendedAgents: string[];
}

export interface UserInteraction {
  id: string;
  userId: string;
  timestamp: Date;
  message: string;
  context: Record<string, any>;
  agentResponses: {
    agentId: string;
    response: string;
    modelUsed: string;
    confidenceScore: number;
    processingTimeMs: number;
  }[];
  securityAnalysis?: {
    riskLevel: number;
    recommendations: string[];
    threadId?: string;
  };
  userFeedback?: {
    rating: number;
    comments?: string;
    helpfulAgents?: string[];
  };
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

export interface AgentCollaboration {
  primaryAgentId: string;
  secondaryAgentIds: string[];
  synergisticTopics: string[];
  collaborativeScore: number;
}
