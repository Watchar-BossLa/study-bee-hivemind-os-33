
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
  role: string;
  specialization: string[];
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
