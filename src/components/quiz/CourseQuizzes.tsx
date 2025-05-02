import React, { useState, useEffect } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizList } from './QuizList';
import { QuizAttemptComponent } from './QuizAttempt';
import { QuizResults } from './QuizResults';
import { CurriculumQuiz, QuizAttempt } from '@/types/quiz';
import { supabase } from '@/integrations/supabase/client';
import { SectionErrorBoundary } from '@/components/error/SectionErrorBoundary';

interface CourseQuizzesProps {
  subjectId: string | undefined;
  moduleId: string | undefined;
  courseId: string | undefined;
}

export function CourseQuizzes({ subjectId, moduleId, courseId }: CourseQuizzesProps) {
  const { 
    loading, 
    quizzes, 
    quizProgress,
    loadCourseQuizzes, 
    loadUserProgress,
    submitAttempt
  } = useQuiz();
  
  const [selectedQuiz, setSelectedQuiz] = useState<CurriculumQuiz | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  
  useEffect(() => {
    if (subjectId && moduleId && courseId) {
      loadCourseQuizzes(subjectId, moduleId, courseId);
      loadUserProgress();
    }
  }, [subjectId, moduleId, courseId]);

  const handleSelectQuiz = (quiz: CurriculumQuiz) => {
    setSelectedQuiz(quiz);
    setCurrentAttempt(null);
  };

  const handleCancelQuiz = () => {
    setSelectedQuiz(null);
    setCurrentAttempt(null);
  };

  const handleCompleteQuiz = async (attempt: Omit<QuizAttempt, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const fullAttempt = {
        ...attempt,
        userId: user.id
      };
      
      await submitAttempt(fullAttempt);
      
      // Set the current attempt with an ID for display
      setCurrentAttempt({
        ...fullAttempt,
        id: `temp-${Date.now()}` // This will be replaced by the real ID from the backend
      });
      
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  const handleRetakeQuiz = () => {
    // Keep the selected quiz but reset the attempt
    setCurrentAttempt(null);
  };

  const handleCloseResults = () => {
    // Reset everything
    setSelectedQuiz(null);
    setCurrentAttempt(null);
  };

  // Determine which view to show
  if (currentAttempt) {
    return (
      <SectionErrorBoundary sectionName="QuizResults">
        <QuizResults 
          attempt={currentAttempt} 
          onRetake={handleRetakeQuiz} 
          onClose={handleCloseResults}
        />
      </SectionErrorBoundary>
    );
  }

  if (selectedQuiz) {
    return (
      <SectionErrorBoundary sectionName="QuizAttempt">
        <QuizAttemptComponent 
          quiz={selectedQuiz} 
          onComplete={handleCompleteQuiz} 
          onCancel={handleCancelQuiz}
        />
      </SectionErrorBoundary>
    );
  }

  return (
    <SectionErrorBoundary sectionName="QuizList">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Practice Quizzes</h2>
        <QuizList 
          quizzes={quizzes} 
          quizProgress={quizProgress} 
          loading={loading} 
          onSelectQuiz={handleSelectQuiz}
        />
      </div>
    </SectionErrorBoundary>
  );
}
