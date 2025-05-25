
import { CouncilVote } from '../../../types/councils';
import { SpecializedAgent } from '../../../types/agents';

export interface PlanTask {
  id: string;
  title?: string;
  description?: string;
  priority?: number;
}

export interface Plan {
  id: string;
  title: string;
  type?: string;
  summary?: string;
  tasks: PlanTask[];
  members?: string[];
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
