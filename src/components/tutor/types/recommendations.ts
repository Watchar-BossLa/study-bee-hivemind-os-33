
export interface LearningRecommendation {
  id: string;
  type: 'personalized' | 'quantum_enhanced' | 'adaptive' | 'collaborative';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action: {
    type: 'study_path' | 'practice_quiz' | 'review_concept' | 'collaborative_session';
    target: string;
    metadata?: Record<string, any>;
  };
  estimatedImpact: number;
  reasoning: string;
  confidence: number;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface RecommendationContext {
  userId: string;
  currentSubject?: string;
  skillLevel?: string;
  learningGoals?: string[];
  timeAvailable?: number;
  preferences?: {
    learningStyle: string;
    difficulty: string;
    interactionType: string;
  };
}
