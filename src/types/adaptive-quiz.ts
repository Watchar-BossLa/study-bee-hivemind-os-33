
/**
 * Types for the Adaptive Quiz Platform
 */

export interface AdaptiveQuizConfig {
  id: string;
  title: string;
  description: string;
  initialDifficulty: QuizDifficulty;
  adaptationStrategy: 'performance' | 'confidence' | 'combined';
  passingThreshold: number; // Percentage (0-100)
  timeLimit?: number; // In seconds, optional
  showFeedback: boolean;
  showCorrectAnswers: boolean;
  maxQuestions: number;
  topicId: string;
  subjectId: string;
}

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface AdaptiveQuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  difficulty: QuizDifficulty;
  correctOptionId: string;
  explanation: string;
  topicId: string;
  conceptId?: string;
  timeEstimate?: number; // In seconds
  imageUrl?: string;
  tags: string[];
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AdaptiveQuizSession {
  id: string;
  userId: string;
  quizConfigId: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  currentDifficulty: QuizDifficulty;
  questionsAnswered: AdaptiveQuizAnswer[];
  status: 'in-progress' | 'completed' | 'abandoned';
  score: number;
  maxScore: number;
  adaptiveSequence: AdaptiveSequenceItem[];
  timeRemaining?: number;
}

export interface AdaptiveQuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  difficulty: QuizDifficulty;
  timeSpent: number; // In seconds
  confidence?: 'low' | 'medium' | 'high';
}

export interface AdaptiveSequenceItem {
  questionId: string;
  difficulty: QuizDifficulty;
  reason: string;
}

export interface QuizPerformanceMetrics {
  userId: string;
  quizId: string;
  averageScore: number;
  completionTime: number; // In seconds
  correctAnswers: number;
  totalQuestions: number;
  difficultyLevels: Record<QuizDifficulty, number>; // Count of questions per difficulty
  topicPerformance: Record<string, number>; // Score per topic (0-100)
  challengeAreas: string[]; // Topics with lowest performance
  strengths: string[]; // Topics with highest performance
  date: Date;
}

export interface ConfidenceBasedMetrics {
  overconfidenceScore: number; // Higher = more overconfident
  underconfidenceScore: number; // Higher = more underconfident
  accurateAssessmentScore: number; // Higher = better self-assessment
  confidenceToPerformanceCorrelation: number; // -1 to 1, higher = better correlation
}

export interface AdaptiveQuizResult {
  sessionId: string;
  quizId: string;
  userId: string;
  finalScore: number;
  maxScore: number;
  performance: QuizPerformanceMetrics;
  confidenceMetrics?: ConfidenceBasedMetrics;
  masteryLevel: QuizDifficulty;
  recommendations: string[];
  nextStepsTopics: string[];
  completedAt: Date;
  passed: boolean;
}
