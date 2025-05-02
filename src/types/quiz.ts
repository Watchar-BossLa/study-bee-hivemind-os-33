
import { QuizQuestion } from './arena';

export interface CurriculumQuiz {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  courseId: string;
  subjectId: string;
  questions: QuizQuestion[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts?: number; // maximum attempts allowed
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  maxScore: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent?: number; // in seconds
  }[];
  startedAt: string;
  completedAt?: string;
  passed: boolean;
}

export interface QuizProgress {
  completedQuizzes: string[];
  attemptedQuizzes: Record<string, number>; // quizId: attempts
  scores: Record<string, number>; // quizId: highestScore
}
