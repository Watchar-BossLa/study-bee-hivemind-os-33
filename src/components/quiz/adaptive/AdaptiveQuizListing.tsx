
import React from 'react';
import { AdaptiveQuizConfig } from '@/types/adaptive-quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Clock, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AdaptiveQuizListingProps {
  quizzes: AdaptiveQuizConfig[];
  loading: boolean;
  onStartQuiz: (quizId: string) => void;
}

export const AdaptiveQuizListing = ({ quizzes, loading, onStartQuiz }: AdaptiveQuizListingProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-7 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <h3 className="text-lg font-medium">No Quizzes Available</h3>
          <p className="text-muted-foreground mt-2">There are no adaptive quizzes available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                {quiz.title}
              </CardTitle>
              <Badge className={getDifficultyColor(quiz.initialDifficulty)}>
                {quiz.initialDifficulty.charAt(0).toUpperCase() + quiz.initialDifficulty.slice(1)}
              </Badge>
            </div>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Adaptive: {quiz.adaptationStrategy}</span>
              </div>
              
              {quiz.timeLimit && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(quiz.timeLimit / 60)} min</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span>Questions: {quiz.maxQuestions}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span>Passing: {quiz.passingThreshold}%</span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {quiz.topicId}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {quiz.subjectId}
              </Badge>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button onClick={() => onStartQuiz(quiz.id)}>
              Start Adaptive Quiz
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
