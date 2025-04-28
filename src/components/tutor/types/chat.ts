
export interface MessageType {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  modelUsed?: string;
  relatedTopics?: string[];
  agentContributors?: string[];
  loading?: boolean;
  complexity?: 'low' | 'medium' | 'high';
  processingTime?: number;
  userRating?: number;
  requestFeedback?: boolean;
  agentAnalysis?: {
    primaryDomain?: string;
    confidenceScores?: Record<string, number>;
    specializedInputs?: Record<string, string>;
    recommendedFollowup?: string[];
  };
  knowledgeGraphNodes?: string[];
  learnMoreLinks?: Array<{title: string, url: string}>;
}

export interface AgentContribution {
  agentId: string;
  agentName: string;
  contributionWeight: number; // 0-1 representing importance of contribution
  specializedContent?: string;
  confidence: number;
  domain: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: MessageType[];
  activePath?: string;
  primaryDomains: string[];
  complexity: 'low' | 'medium' | 'high';
  userSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  startTime: Date;
  lastActive: Date;
  topAgents: string[];
  preferredModality: 'text' | 'visual' | 'interactive';
  sessionMetrics: {
    averageResponseTime: number;
    userSatisfaction: number;
    completionRate: number;
    topicsExplored: number;
  };
}
