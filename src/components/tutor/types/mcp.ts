
import { SpecializedAgent } from './agents';

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  content: string;
  priority: TaskPriority;
  createdAt: Date;
  deadline?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  content: string;
  type: string;
  correlationId?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface AgentMetrics {
  avgProcessingTime: number;
  successRate: number;
}

export interface AgentQuota {
  maxConcurrentTasks: number;
  currentUsage: number;
}
