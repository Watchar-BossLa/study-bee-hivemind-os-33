
export type RouterRequest = {
  query: string;
  task: 'tutor' | 'qa' | 'summarization' | 'code' | 'reasoning';
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  costSensitivity: 'low' | 'medium' | 'high';
  contextLength?: number;
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredModality?: 'text' | 'visual' | 'interactive';
  previousSuccess?: Record<string, number>;
  topicId?: string;
  domain?: string;
  agentSpecialization?: string[];
  adaptivePathId?: string;
};

export interface ModelSelectionResult {
  modelId: string;
  confidence: number;
  fallbackOptions: string[];
  reasoningTrace: string[];
  estimatedCost?: number;
  estimatedLatency?: number;
  specializedCapabilities?: string[];
}

export interface AgentSelectionResult {
  agentIds: string[];
  confidence: number;
  reasoningTrace: string[];
  expertiseMatch: Record<string, number>;
}
