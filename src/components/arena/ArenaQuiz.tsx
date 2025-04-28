
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, X, Clock, AlertTriangle } from 'lucide-react';
import { QuizQuestion, MatchPlayer } from '@/types/arena';
import { ArenaPlayers } from './ArenaPlayers';

interface ArenaQuizProps {
  question: QuizQuestion;
  timeLeft: number;
  selectedAnswer: string | null;
  onAnswer: (answer: 'a' | 'b' | 'c' | 'd') => void;
  questionNumber: number;
  totalQuestions: number;
  matchComplete: boolean;
  players: MatchPlayer[];
  loading?: boolean;
  error?: string | null;
}

export const ArenaQuiz = ({
  question,
  timeLeft,
  selectedAnswer,
  onAnswer,
  questionNumber,
  totalQuestions,
  matchComplete,
  players,
  loading = false,
  error = null
}: ArenaQuizProps) => {
  if (matchComplete) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Match Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <ArenaPlayers players={players} showResults />
          <div className="mt-4 text-center">
            <p className="text-lg font-medium">Thanks for playing!</p>
            <p className="text-muted-foreground">Check the leaderboard to see your ranking.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Loading Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" variant="outline">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const getOptionClass = (option: string) => {
    if (!selectedAnswer) return '';
    
    if (option === question.correct_answer) {
      return 'bg-green-100 border-green-500 dark:bg-green-900/30';
    }
    
    if (selectedAnswer === option && option !== question.correct_answer) {
      return 'bg-red-100 border-red-500 dark:bg-red-900/30';
    }
    
    return '';
  };

  const difficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };

  const getTimeLeftClass = () => {
    if (timeLeft <= 5) return 'text-red-500';
    if (timeLeft <= 10) return 'text-yellow-500';
    return '';
  };

  return (
    <>
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Question {questionNumber} of {totalQuestions}</CardTitle>
              <CardDescription>
                Category: {question.category} | 
                <span className={difficultyColor()}> {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}</span>
              </CardDescription>
            </div>
            <div className={`flex items-center gap-2 rounded-full bg-accent/50 px-3 py-1 ${getTimeLeftClass()}`}>
              <Clock className={`h-4 w-4 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
              <span>{timeLeft}s</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={(timeLeft / 15) * 100} className="h-2" />
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-medium">{question.question}</h3>
          </div>
          <div className="grid gap-3">
            <Button
              variant="outline"
              className={`justify-start p-4 h-auto text-left ${getOptionClass('a')}`}
              onClick={() => onAnswer('a')}
              disabled={!!selectedAnswer}
            >
              <span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">A</span>
              {question.option_a}
              {selectedAnswer && question.correct_answer === 'a' && (
                <Check className="ml-auto h-4 w-4 text-green-500" />
              )}
              {selectedAnswer === 'a' && question.correct_answer !== 'a' && (
                <X className="ml-auto h-4 w-4 text-red-500" />
              )}
            </Button>
            <Button
              variant="outline"
              className={`justify-start p-4 h-auto text-left ${getOptionClass('b')}`}
              onClick={() => onAnswer('b')}
              disabled={!!selectedAnswer}
            >
              <span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">B</span>
              {question.option_b}
              {selectedAnswer && question.correct_answer === 'b' && (
                <Check className="ml-auto h-4 w-4 text-green-500" />
              )}
              {selectedAnswer === 'b' && question.correct_answer !== 'b' && (
                <X className="ml-auto h-4 w-4 text-red-500" />
              )}
            </Button>
            <Button
              variant="outline"
              className={`justify-start p-4 h-auto text-left ${getOptionClass('c')}`}
              onClick={() => onAnswer('c')}
              disabled={!!selectedAnswer}
            >
              <span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">C</span>
              {question.option_c}
              {selectedAnswer && question.correct_answer === 'c' && (
                <Check className="ml-auto h-4 w-4 text-green-500" />
              )}
              {selectedAnswer === 'c' && question.correct_answer !== 'c' && (
                <X className="ml-auto h-4 w-4 text-red-500" />
              )}
            </Button>
            <Button
              variant="outline"
              className={`justify-start p-4 h-auto text-left ${getOptionClass('d')}`}
              onClick={() => onAnswer('d')}
              disabled={!!selectedAnswer}
            >
              <span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">D</span>
              {question.option_d}
              {selectedAnswer && question.correct_answer === 'd' && (
                <Check className="ml-auto h-4 w-4 text-green-500" />
              )}
              {selectedAnswer === 'd' && question.correct_answer !== 'd' && (
                <X className="ml-auto h-4 w-4 text-red-500" />
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Select the correct answer before time runs out!
        </CardFooter>
      </Card>
      <div className="col-span-2 md:col-span-1">
        <ArenaPlayers players={players} live />
      </div>
    </>
  );
};
