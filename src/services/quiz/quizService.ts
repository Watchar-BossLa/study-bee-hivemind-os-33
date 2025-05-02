
import { supabase } from '@/integrations/supabase/client';
import { CurriculumQuiz, QuizAttempt } from '@/types/quiz';
import { QuizQuestion } from '@/types/arena';
import { captureException } from '@/services/monitoring/sentry';
import { mockCurriculumQuizzes, mockQuizAttempts, mockQuizProgress } from '@/data/quizzes/mockQuizzes';

export const quizService = {
  // Get quizzes for a specific course
  async getCourseQuizzes(subjectId: string, moduleId: string, courseId: string): Promise<CurriculumQuiz[]> {
    try {
      // Return mock data instead of querying Supabase
      // Filter by the provided IDs to simulate database filtering
      return mockCurriculumQuizzes.filter(quiz => 
        quiz.subjectId === subjectId && 
        quiz.moduleId === moduleId && 
        quiz.courseId === courseId
      );
    } catch (error) {
      captureException(error as Error);
      return [];
    }
  },

  // Submit a quiz attempt
  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<string | null> {
    try {
      // Simulate successful submission
      return `temp-${Date.now()}`;
    } catch (error) {
      captureException(error as Error);
      return null;
    }
  },

  // Get user's quiz attempts for a specific quiz
  async getUserQuizAttempts(quizId: string, userId: string): Promise<QuizAttempt[]> {
    try {
      // Return filtered mock attempts
      return mockQuizAttempts.filter(
        attempt => attempt.quizId === quizId && attempt.userId === userId
      );
    } catch (error) {
      captureException(error as Error);
      return [];
    }
  },

  // Get user's overall quiz progress
  async getUserQuizProgress(userId: string): Promise<Record<string, number>> {
    try {
      // Return mock progress
      return mockQuizProgress;
    } catch (error) {
      captureException(error as Error);
      return {};
    }
  }
};
