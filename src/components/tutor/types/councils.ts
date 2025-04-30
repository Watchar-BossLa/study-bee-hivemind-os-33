
import { SpecializedAgent } from './agents';

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
  plan?: {
    id: string;
    title: string;
    taskCount: number;
    memberCount: number;
  };
  securityAnalysis?: {
    riskLevel: number;
    recommendations: string[];
    threadId?: string;
  };
}

export interface Council {
  id: string;
  agents: SpecializedAgent[];
  description?: string;
  capabilities?: string[];
  externalIntegrations?: string[];
}

export interface AutogenThread {
  id: string;
  agents: string[];
  messages: {
    from: string;
    content: string;
    timestamp: Date;
  }[];
  status: 'active' | 'completed' | 'failed';
  topic: string;
  maxTurns?: number;
  currentTurn?: number;
  securityContext?: {
    threatModel: string;
    vulnerabilityChecklist: string[];
    mitigations: string[];
  };
}

export interface LangChainTemplate {
  id: string;
  name: string;
  template: string;
  inputVariables: string[];
  outputParser?: string;
  rateLimits?: {
    maxRequestsPerMinute: number;
    maxTokensPerRequest: number;
    costPerToken: number;
  };
}

export interface AgentMessageExchange {
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  protocol: string;
  metrics?: {
    latencyMs: number;
    tokenCount?: number;
    success: boolean;
  };
}

export interface SwarmTask {
  id: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  assignedAgents: string[];
  result?: any;
  processingTimeMs?: number;
  parentTaskId?: string;
}

export interface SwarmMetrics {
  timestamp: Date;
  tasksExecuted: number;
  averageTaskTimeMs: number;
  successRate: number;
  fanoutFactor: number;
  tokenUsage: number;
}
