
export interface LearningVelocityMetrics {
  conceptMastery: Record<string, number>;
  learningRate: number;
  retentionScore: number;
  difficultyProgression: number[];
  cognitiveLoadIndex: number;
  adaptationSpeed: number;
}

export interface PredictiveModel {
  difficultyPrediction: number;
  timeToMastery: number;
  strugglingConcepts: string[];
  recommendedIntervention: 'none' | 'review' | 'alternative_approach' | 'tutor_assistance';
  confidenceLevel: number;
}

export interface InterventionAlert {
  id: string;
  userId: string;
  alertType: 'learning_plateau' | 'concept_confusion' | 'rapid_decline' | 'attention_drift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  concept: string;
  description: string;
  suggestedActions: string[];
  timestamp: Date;
  resolved: boolean;
}

export interface SessionData {
  concept: string;
  timeSpent: number;
  accuracy: number;
  attempts: number;
  difficulty: number;
}

export interface QuantumLearningInsights {
  coherenceScore: number;
  entanglementLevel: number;
  superpositionStates: string[];
}
