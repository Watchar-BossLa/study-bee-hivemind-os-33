
import { CouncilVote } from '../../../types/councils';
import { SpecializedAgent } from '../../../types/agents';

export interface PlanTask {
  taskId: string;
  description: string;
  status: string;
  assignedAgentId?: string;
}

export interface Plan {
  planId: string;
  type: string;
  summary: string;
  tasks?: PlanTask[];
  members?: Array<{ id: string; name: string; role: string; }>;
  memberCount?: number;
}

export interface VotingOptions {
  baseThreshold?: number;
  minRequiredVotes?: number;
  timeLimit?: number;
  complexityOverride?: 'low' | 'medium' | 'high';
}

export interface VoteResult {
  votes: CouncilVote[];
  suggestion: string;
  confidence: number;
  suspiciousVotes?: CouncilVote[];
}
