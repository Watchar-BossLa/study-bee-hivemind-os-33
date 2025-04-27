
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
}
