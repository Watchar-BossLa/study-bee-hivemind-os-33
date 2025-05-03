
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArenaQuiz } from './ArenaQuiz';
import { ArenaPlayers } from './ArenaPlayers';
import { ArenaMatchWaiting } from './ArenaMatchWaiting';
import { QuizQuestion, MatchPlayer, QuizAnswer, ArenaMatch } from '@/types/arena';

interface ArenaMatchViewProps {
  currentMatch: ArenaMatch;
  players: MatchPlayer[];
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  timeLeft: number;
  matchComplete: boolean;
  onAnswer: (answer: 'a' | 'b' | 'c' | 'd') => void;
  onJoinMatch: () => void;
}

export const ArenaMatchView: React.FC<ArenaMatchViewProps> = ({
  currentMatch,
  players,
  questions,
  currentQuestionIndex,
  selectedAnswer,
  timeLeft,
  matchComplete,
  onAnswer,
  onJoinMatch
}) => {
  if (matchComplete) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Match Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <ArenaPlayers players={players} showResults />
          <div className="mt-4 flex justify-center">
            <Button onClick={onJoinMatch}>Play Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentMatch.status === 'active' && questions.length > 0) {
    return (
      <ArenaQuiz 
        question={questions[currentQuestionIndex]} 
        timeLeft={timeLeft}
        selectedAnswer={selectedAnswer}
        onAnswer={onAnswer as (answer: QuizAnswer) => void}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        matchComplete={matchComplete}
        players={players}
      />
    );
  }

  return (
    <ArenaMatchWaiting currentMatch={currentMatch} players={players} />
  );
};
