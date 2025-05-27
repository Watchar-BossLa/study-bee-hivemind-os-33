
export interface AdaptationAction {
  id: string;
  type: 'difficulty_adjustment' | 'pacing_change' | 'content_switch' | 'break_suggestion' | 'hint_provision';
  description: string;
  parameters: Record<string, any>;
  confidence: number;
  appliedAt: Date;
  effectiveness?: number;
}

export interface RealTimeMetrics {
  currentAccuracy: number;
  responseTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  timeOnTask: number;
  frustrationLevel: number;
  engagementLevel: number;
  cognitiveLoad: number;
}

export interface AdaptationThresholds {
  difficultyIncrease: { accuracy: number; consecutiveCorrect: number };
  difficultyDecrease: { accuracy: number; consecutiveIncorrect: number };
  breakSuggestion: { timeOnTask: number; frustrationLevel: number };
  hintProvision: { responseTime: number; cognitiveLoad: number };
  contentSwitch: { engagementLevel: number; timeOnTask: number };
}
