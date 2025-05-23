
import React from 'react';
import { AdaptiveQuizResult } from '@/types/adaptive-quiz';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, BarChart, ChevronRight, Clock } from 'lucide-react';

interface AdaptiveQuizResultsProps {
  result: AdaptiveQuizResult;
  onReturnToListing: () => void;
}

export const AdaptiveQuizResults = ({ result, onReturnToListing }: AdaptiveQuizResultsProps) => {
  const scorePercentage = (result.finalScore / result.maxScore) * 100;
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getScoreColor = () => {
    if (scorePercentage >= 90) return 'text-green-500';
    if (scorePercentage >= 70) return 'text-blue-500';
    if (scorePercentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMasteryColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'expert': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center border-b">
        <CardTitle className="flex flex-col items-center gap-2">
          {result.passed ? (
            <>
              <Award className="h-12 w-12 text-yellow-500" />
              <span>Quiz Passed!</span>
            </>
          ) : (
            <span>Quiz Completed</span>
          )}
        </CardTitle>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Score: {result.finalScore}/{result.maxScore}</span>
            <span className={getScoreColor()}>{scorePercentage.toFixed(0)}%</span>
          </div>
          <Progress 
            value={scorePercentage} 
            className={`h-3 ${
              result.passed 
                ? 'bg-green-100 [&>div]:bg-green-500' 
                : 'bg-red-100 [&>div]:bg-red-500'
            }`}
          />
        </div>
      </CardHeader>
      
      <CardContent className="divide-y">
        <div className="py-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium mb-2">Performance Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Spent:</span>
                <span>{formatTime(result.performance.completionTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Correct Answers:</span>
                <span>{result.performance.correctAnswers} of {result.performance.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mastery Level:</span>
                <Badge className={getMasteryColor(result.masteryLevel)}>
                  {result.masteryLevel.charAt(0).toUpperCase() + result.masteryLevel.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Difficulty Levels</h3>
            <div className="space-y-2">
              {Object.entries(result.performance.difficultyLevels).map(([difficulty, count]) => {
                if (count > 0) {
                  return (
                    <div key={difficulty} className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}:
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={count / result.performance.totalQuestions * 100}
                          className="w-24 h-2"
                        />
                        <span className="text-sm">{count}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
        
        <div className="py-6">
          <h3 className="text-lg font-medium mb-3">Recommended Next Steps</h3>
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="py-6">
          <h3 className="text-lg font-medium mb-3">Suggested Topics</h3>
          <div className="flex flex-wrap gap-2">
            {result.nextStepsTopics.map((topic, index) => (
              <Badge key={index} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        
        {result.confidenceMetrics && (
          <div className="py-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Confidence Analysis
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Accurate Self-Assessment:</span>
                <Progress 
                  value={result.confidenceMetrics.accurateAssessmentScore * 100}
                  className="mt-1 h-2"
                />
                <p className="text-sm mt-1">
                  {(result.confidenceMetrics.accurateAssessmentScore * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Overconfidence Score:</span>
                <Progress 
                  value={result.confidenceMetrics.overconfidenceScore * 100}
                  className="mt-1 h-2 bg-yellow-100 [&>div]:bg-yellow-500"
                />
                <p className="text-sm mt-1">
                  {(result.confidenceMetrics.overconfidenceScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="py-6 text-center text-sm text-muted-foreground">
          <Clock className="inline-block h-4 w-4 mr-1" />
          Completed on {new Date(result.completedAt).toLocaleString()}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button onClick={onReturnToListing}>
          Return to Quiz Listing
        </Button>
      </CardFooter>
    </Card>
  );
};
