
import { CouncilVote } from '../../../types/councils';

export interface PlanTask {
  taskId: string;
  description: string;
  status: string;
  assignedAgentId?: string;
}

export interface Plan {
  planId: string;
  id: string;       // Required to match CrewAIPlanner's Plan interface
  type: string;
  summary: string;
  title: string;    // Required to match CrewAIPlanner's Plan interface
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
