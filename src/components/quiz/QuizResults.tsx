
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Award } from 'lucide-react';
import { QuizAttempt } from '@/types/quiz';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onClose: () => void;
}

export function QuizResults({ attempt, onRetake, onClose }: QuizResultsProps) {
  const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="text-center border-b">
        <CardTitle className="flex flex-col items-center gap-2">
          {attempt.passed ? (
            <>
              <Award className="h-12 w-12 text-yellow-500" />
              <span>Quiz Passed!</span>
            </>
          ) : (
            <>
              <X className="h-12 w-12 text-red-500" />
              <span>Quiz Failed</span>
            </>
          )}
        </CardTitle>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Score: {attempt.score}/{attempt.maxScore}</span>
            <span>{percentage}%</span>
          </div>
          <Progress 
            value={percentage} 
            className={`h-3 ${
              attempt.passed 
                ? 'bg-green-100 [&>div]:bg-green-500' 
                : 'bg-red-100 [&>div]:bg-red-500'
            }`}
          />
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Completed on {new Date(attempt.completedAt || '').toLocaleString()}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">Answer Summary</h3>
        
        <div className="space-y-4">
          {attempt.answers.map((answer, index) => (
            <div key={answer.questionId} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Question {index + 1}</div>
                {answer.isCorrect ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <Check className="h-3 w-3 mr-1" /> Correct
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    <X className="h-3 w-3 mr-1" /> Incorrect
                  </Badge>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {answer.timeSpent && (
                  <div>Time spent: {answer.timeSpent} seconds</div>
                )}
                <div>Your answer: {answer.selectedAnswer.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onRetake}>
          Take Quiz Again
        </Button>
      </CardFooter>
    </Card>
  );
}
