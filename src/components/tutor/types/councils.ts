
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
}

export interface LangChainTemplate {
  id: string;
  name: string;
  template: string;
  inputVariables: string[];
}

export interface AgentMessageExchange {
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  protocol: string;
}
