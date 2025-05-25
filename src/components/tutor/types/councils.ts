
export interface CouncilVote {
  agentId: string;
  vote: 'approve' | 'reject' | 'abstain';
  reasoning: string;
  confidence?: number;
  timestamp?: Date;
  suggestion?: string;
}

export interface CouncilDecision {
  topic: string;
  votes: CouncilVote[];
  consensus: string;
  confidenceScore: number;
  timestamp: Date;
  securityAnalysis?: {
    riskLevel: number;
    recommendations: string[];
    threadId?: string;
  };
  plan?: {
    id: string;
    title: string;
    taskCount: number;
    memberCount: number;
  };
}

export interface CouncilMember {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  votingWeight: number;
  isActive: boolean;
}

export interface CouncilSession {
  id: string;
  councilId: string;
  topic: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  participants: string[];
  decisions: CouncilDecision[];
}
