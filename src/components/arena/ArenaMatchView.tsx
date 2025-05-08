
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArenaQuiz } from './ArenaQuiz';
import { ArenaPlayers } from './ArenaPlayers';
import { ArenaMatchWaiting } from './ArenaMatchWaiting';
import ArenaChat from './chat/ArenaChat'; // Changed to default import
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
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
        
        <div className="md:col-span-1 h-full">
          <ArenaChat matchId={currentMatch.id} players={players} />
        </div>
      </div>
    );
  }

  if (currentMatch.status === 'active' && questions.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ArenaQuiz 
          question={questions[currentQuestionIndex]} 
          timeLeft={timeLeft}
          selectedAnswer={selectedAnswer}
          onAnswer={onAnswer as (answer: QuizAnswer) => void}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          matchComplete={matchComplete}
          players={players}
          className="md:col-span-2"
        />
        
        <div className="md:col-span-1 h-full">
          <ArenaChat matchId={currentMatch.id} players={players} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ArenaMatchWaiting 
        currentMatch={currentMatch} 
        players={players}
        className="md:col-span-2" 
      />
      
      <div className="md:col-span-1 h-full">
        <ArenaChat matchId={currentMatch.id} players={players} />
      </div>
    </div>
  );
};
