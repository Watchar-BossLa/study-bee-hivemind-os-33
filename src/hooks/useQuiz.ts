
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { quizService } from '@/services/quiz/quizService';
import { CurriculumQuiz, QuizAttempt } from '@/types/quiz';
import { supabase } from '@/integrations/supabase/client';

export function useQuiz() {
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<CurriculumQuiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<CurriculumQuiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [quizProgress, setQuizProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const loadCourseQuizzes = async (subjectId: string, moduleId: string, courseId: string) => {
    try {
      setLoading(true);
      const courseQuizzes = await quizService.getCourseQuizzes(subjectId, moduleId, courseId);
      setQuizzes(courseQuizzes);
      return courseQuizzes;
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load course quizzes',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadQuizAttempts = async (quizId: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const userAttempts = await quizService.getUserQuizAttempts(quizId, user.id);
      setAttempts(userAttempts);
      return userAttempts;
    } catch (error) {
      console.error('Error loading quiz attempts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quiz attempts',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};
      
      const progress = await quizService.getUserQuizProgress(user.id);
      setQuizProgress(progress);
      return progress;
    } catch (error) {
      console.error('Error loading quiz progress:', error);
      return {};
    } finally {
      setLoading(false);
    }
  };

  const submitAttempt = async (attempt: Omit<QuizAttempt, 'id'>) => {
    try {
      setLoading(true);
      const attemptId = await quizService.submitQuizAttempt(attempt);
      
      if (attemptId) {
        toast({
          title: 'Quiz Completed',
          description: `Your score: ${attempt.score}/${attempt.maxScore}`,
        });
        
        // Refresh attempts
        if (attempt.quizId && attempt.userId) {
          await loadQuizAttempts(attempt.quizId);
          await loadUserProgress();
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz attempt',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    quizzes,
    currentQuiz,
    setCurrentQuiz,
    attempts,
    quizProgress,
    loadCourseQuizzes,
    loadQuizAttempts,
    loadUserProgress,
    submitAttempt
  };
}
