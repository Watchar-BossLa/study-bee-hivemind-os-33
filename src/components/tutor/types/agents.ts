
export interface Agent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'busy';
  createdAt: Date;
}

export interface SpecializedAgent extends Agent {
  specialization: string;
  expertise: string[];
  confidenceLevel: number;
  lastActive: Date;
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
