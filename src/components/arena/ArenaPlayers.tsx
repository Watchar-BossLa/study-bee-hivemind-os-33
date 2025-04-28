
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchPlayer } from '@/types/arena';
import { Users, Trophy, Medal, Crown, Award } from 'lucide-react';

interface ArenaPlayersProps {
  players: MatchPlayer[];
  showResults?: boolean;
  live?: boolean;
}

export const ArenaPlayers = ({ players, showResults = false, live = false }: ArenaPlayersProps) => {
  // Sort players by score, highest first
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-amber-700" />;
      default: return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm">
          {rank + 1}
        </span>
      );
    }
  };

  // Calculate rank changes (simulated for this example)
  const getRankChange = (playerId: string, index: number) => {
    // In a real implementation, this would compare previous match rankings
    const changeValue = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    
    if (changeValue > 0) {
      return <span className="text-green-500 text-xs">↑ {changeValue}</span>;
    } else if (changeValue < 0) {
      return <span className="text-red-500 text-xs">↓ {Math.abs(changeValue)}</span>;
    }
    return null;
  };

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
                {getRankIcon(index)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Player {player.user_id.substring(0, 4)}</span>
                      {showResults && getRankChange(player.user_id, index)}
                      {player.streak > 2 && (
                        <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                          {player.streak}🔥
                        </span>
                      )}
                    </div>
                    <span className="font-semibold">{player.score} pts</span>
                  </div>
                  {showResults && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>{player.correct_answers} / {player.questions_answered} correct answers</span>
                        {player.correct_answers === player.questions_answered && player.questions_answered > 0 && (
                          <Award className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                      <div className="mt-1">
                        <span>Avg. response time: {Math.round(player.total_response_time / Math.max(player.questions_answered, 1) * 10) / 10}s</span>
                      </div>
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
