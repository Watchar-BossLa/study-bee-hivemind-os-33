import { supabase } from '@/integrations/supabase/client';
import { CurriculumQuiz, QuizAttempt } from '@/types/quiz';
import { QuizQuestion } from '@/types/arena';
import { captureException } from '@/services/monitoring/sentry';

export const quizService = {
  // Get quizzes for a specific course
  async getCourseQuizzes(subjectId: string, moduleId: string, courseId: string): Promise<CurriculumQuiz[]> {
    try {
      const { data, error } = await supabase
        .from('curriculum_quizzes')
        .select('*, questions:quiz_questions(*)')
        .eq('subject_id', subjectId)
        .eq('module_id', moduleId)
        .eq('course_id', courseId);

      if (error) throw error;
      
      return (data || []).map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        moduleId: quiz.module_id,
        courseId: quiz.course_id,
        subjectId: quiz.subject_id,
        questions: quiz.questions as unknown as QuizQuestion[],
        difficulty: quiz.difficulty,
        passingScore: quiz.passing_score,
        timeLimit: quiz.time_limit,
        attempts: quiz.attempts
      }));
    } catch (error) {
      captureException(error as Error);
      return [];
    }
  },

  // Submit a quiz attempt
  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: attempt.quizId,
          user_id: attempt.userId,
          score: attempt.score,
          max_score: attempt.maxScore,
          answers: attempt.answers,
          started_at: attempt.startedAt,
          completed_at: attempt.completedAt,
          passed: attempt.passed
        })
        .select('id')
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      captureException(error as Error);
      return null;
    }
  },

  // Get user's quiz attempts for a specific quiz
  async getUserQuizAttempts(quizId: string, userId: string): Promise<QuizAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizId)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((attempt) => ({
        id: attempt.id,
        quizId: attempt.quiz_id,
        userId: attempt.user_id,
        score: attempt.score,
        maxScore: attempt.max_score,
        answers: attempt.answers,
        startedAt: attempt.started_at,
        completedAt: attempt.completed_at,
        passed: attempt.passed
      }));
    } catch (error) {
      captureException(error as Error);
      return [];
    }
  },

  // Get user's overall quiz progress
  async getUserQuizProgress(userId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('quiz_id, score')
        .eq('user_id', userId);

      if (error) throw error;
      
      const progressMap: Record<string, number> = {};
      
      // Group by quiz ID and keep highest score
      if (data) {
        data.forEach((attempt) => {
          const quizId = attempt.quiz_id;
          const score = attempt.score || 0;
          
          if (!progressMap[quizId] || progressMap[quizId] < score) {
            progressMap[quizId] = score;
          }
        });
      }
      
      return progressMap;
    } catch (error) {
      captureException(error as Error);
      return {};
    }
  }
};
