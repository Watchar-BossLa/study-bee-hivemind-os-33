
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gamepad, Star, Trophy } from 'lucide-react';
import type { ArenaStats as ArenaStatsType } from '@/types/arena';

interface ArenaStatsProps {
  stats: ArenaStatsType | null;
}

export const ArenaStats = ({ stats }: ArenaStatsProps) => {
  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad className="h-5 w-5" />
            Your Stats
          </CardTitle>
          <CardDescription>
            Play your first match to start tracking your stats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <p className="text-muted-foreground">No stats available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate accuracy percentage
  const accuracy = stats.questions_answered > 0 
    ? Math.round((stats.correct_answers / stats.questions_answered) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad className="h-5 w-5" />
          Your Stats
        </CardTitle>
        <CardDescription>
          Your quiz performance statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Matches Played</p>
            <p className="text-2xl font-bold">{stats.matches_played}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Matches Won</p>
            <p className="text-2xl font-bold">{stats.matches_won}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Highest Score</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              {stats.highest_score}
              <Star className="h-4 w-4 text-yellow-500" />
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Score</p>
            <p className="text-2xl font-bold">{stats.total_score}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Questions Answered</p>
            <p className="text-2xl font-bold">{stats.questions_answered}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-2xl font-bold">{accuracy}%</p>
          </div>
        </div>

        {stats.matches_won > 0 && (
          <div className="mt-4 rounded-md bg-accent/50 p-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <p className="font-medium">Congratulations!</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              You've won {stats.matches_won} {stats.matches_won === 1 ? 'match' : 'matches'} so far. Keep it up!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
