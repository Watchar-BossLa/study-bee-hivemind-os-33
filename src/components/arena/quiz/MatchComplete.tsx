
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArenaPlayers } from '../ArenaPlayers';
import { MatchPlayer } from '@/types/arena';

interface MatchCompleteProps {
  players: MatchPlayer[];
}

export const MatchComplete: React.FC<MatchCompleteProps> = ({ players }) => {
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
};
