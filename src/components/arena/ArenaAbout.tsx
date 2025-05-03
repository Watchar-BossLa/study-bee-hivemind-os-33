
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export const ArenaAbout: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Welcome to Quiz Arena
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Join a match to compete with other players in real-time quiz battles! Answer questions quickly to earn points and climb the leaderboard.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Join a match and compete with other players by answering questions quickly.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scoring</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Easy: 10pts, Medium: 20pts, Hard: 30pts. Answer faster for better scores!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Earn achievements by winning matches, getting perfect scores, and more!</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
