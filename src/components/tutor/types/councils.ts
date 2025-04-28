
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
}

export interface Council {
  id: string;
  agents: SpecializedAgent[];
  description?: string;
}
