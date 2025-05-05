
import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { QuizQuestion, MatchPlayer } from '@/types/arena';
import { ArenaPlayers } from './ArenaPlayers';
import { QuizHeader } from './quiz/QuizHeader';
import { QuizContent } from './quiz/QuizContent';
import { MatchComplete } from './quiz/MatchComplete';
import { QuizLoadingError } from './quiz/QuizLoadingError';
import { cn } from '@/lib/utils';

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
  className?: string;
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
  error = null,
  className
}: ArenaQuizProps) => {
  if (matchComplete) {
    return <MatchComplete players={players} />;
  }

  const loadingErrorComponent = <QuizLoadingError loading={loading} error={error} />;
  if (loading || error) {
    return loadingErrorComponent;
  }

  return (
    <>
      <Card className={cn(className)}>
        <CardHeader>
          <QuizHeader
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            category={question.category}
            difficulty={question.difficulty}
            timeLeft={timeLeft}
          />
        </CardHeader>
        <CardContent>
          <QuizContent
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswer={onAnswer}
          />
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Select the correct answer before time runs out!
        </CardFooter>
      </Card>
      
      <div className="col-span-2 md:col-span-1 hidden md:block">
        <ArenaPlayers players={players} live />
      </div>
    </>
  );
};
