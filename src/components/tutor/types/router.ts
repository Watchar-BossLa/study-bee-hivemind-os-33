
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
};

export interface ModelSelectionResult {
  modelId: string;
  confidence: number;
  fallbackOptions: string[];
  reasoningTrace: string[];
}
