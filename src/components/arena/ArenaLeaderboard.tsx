
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '@/types/arena';

interface ArenaLeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

export const ArenaLeaderboard = ({ leaderboard }: ArenaLeaderboardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No data yet</p>
            <p className="text-sm text-muted-foreground">Be the first to join a match and appear on the leaderboard!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Matches</TableHead>
                <TableHead className="hidden text-right md:table-cell">Wins</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry, index) => (
                <TableRow key={entry.user_id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <Trophy className="mr-1 h-4 w-4 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="mr-1 h-4 w-4 text-gray-400" />
                      ) : index === 2 ? (
                        <Medal className="mr-1 h-4 w-4 text-amber-700" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>Player {entry.username || entry.user_id.substring(0, 4)}</TableCell>
                  <TableCell className="text-right">{entry.highest_score}</TableCell>
                  <TableCell className="hidden text-right sm:table-cell">{entry.matches_played}</TableCell>
                  <TableCell className="hidden text-right md:table-cell">{entry.matches_won}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
