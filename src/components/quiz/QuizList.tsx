
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, Award } from 'lucide-react';
import { CurriculumQuiz } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';

interface QuizListProps {
  quizzes: CurriculumQuiz[];
  quizProgress: Record<string, number>;
  loading?: boolean;
  onSelectQuiz: (quiz: CurriculumQuiz) => void;
}

export function QuizList({ quizzes, quizProgress, loading = false, onSelectQuiz }: QuizListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-2/3 bg-muted rounded"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-muted rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Quizzes Available</CardTitle>
          <CardDescription>
            There are currently no quizzes for this course.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getQuizStatus = (quizId: string) => {
    const score = quizProgress[quizId];
    if (score === undefined) return null;
    
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return null;
    
    const passed = score >= quiz.passingScore;
    
    return {
      score,
      passed,
      percentage: Math.round((score / quiz.questions.length) * 100)
    };
  };

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => {
        const status = getQuizStatus(quiz.id);
        
        return (
          <Card key={quiz.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  {quiz.title}
                </CardTitle>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                </Badge>
              </div>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>Passing: {quiz.passingScore}/{quiz.questions.length}</span>
                </div>
                {quiz.timeLimit && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{quiz.timeLimit} min</span>
                  </div>
                )}
                {quiz.attempts && (
                  <div className="flex items-center gap-1">
                    <span>Max attempts: {quiz.attempts}</span>
                  </div>
                )}
              </div>

              {status && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Your score: {status.score}/{quiz.questions.length} ({status.percentage}%)
                    </span>
                    {status.passed ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Passed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        Not Passed
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => onSelectQuiz(quiz)}>
                {status ? 'Retake Quiz' : 'Start Quiz'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
