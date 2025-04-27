
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchPlayer } from '@/types/arena';
import { Users, Trophy, Medal } from 'lucide-react';

interface ArenaPlayersProps {
  players: MatchPlayer[];
  showResults?: boolean;
  live?: boolean;
}

export const ArenaPlayers = ({ players, showResults = false, live = false }: ArenaPlayersProps) => {
  // Sort players by score, highest first
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {showResults ? 'Match Results' : 'Players'}
          {live && <span className="ml-2 animate-pulse text-xs font-normal text-red-500">(LIVE)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPlayers.length === 0 ? (
            <p className="text-center text-muted-foreground">No players have joined yet.</p>
          ) : (
            sortedPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                {showResults && index === 0 && (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                )}
                {showResults && index === 1 && (
                  <Medal className="h-5 w-5 text-gray-400" />
                )}
                {showResults && index === 2 && (
                  <Medal className="h-5 w-5 text-amber-700" />
                )}
                {(!showResults || index > 2) && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm">
                    {index + 1}
                  </span>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Player {player.user_id.substring(0, 4)}</span>
                    <span className="font-semibold">{player.score} pts</span>
                  </div>
                  {showResults && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {player.correct_answers} / {player.questions_answered} correct answers
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
