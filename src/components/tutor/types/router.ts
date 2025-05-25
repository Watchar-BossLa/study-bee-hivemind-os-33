
export interface RouterRequest {
  query: string;
  task: string;
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  costSensitivity: 'low' | 'medium' | 'high';
  contextLength?: number;
  userSkillLevel?: string;
  topicId?: string;
  preferredModality?: string;
  previousSuccess?: Record<string, number>;
  promptTokens?: number;
  maxTokens?: number;
}

export interface ModelSelectionResult {
  modelId: string;
  confidence: number;
  fallbackOptions: string[];
  reasoningTrace: string[];
  estimatedCost: number;
  estimatedLatency: number;
  specializedCapabilities: string[];
}
