
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
}

// Define the VotingOptions interface that's used in DeliberationProcessor
export interface VotingOptions {
  baseThreshold?: number;
  minRequiredVotes?: number;
  timeLimit?: number;
  complexityOverride?: 'low' | 'medium' | 'high';
}

export interface VoteCollectionResult {
  votes: CouncilVote[];
  suggestion: string | null;
  confidence: number;
  suspiciousVotes: CouncilVote[];
}
