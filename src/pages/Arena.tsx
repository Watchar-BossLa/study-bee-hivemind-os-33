
import React from 'react';
import { useArena } from '@/hooks/useArena';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Award } from 'lucide-react';

const Arena = () => {
  const { isLoading, currentMatch, players, joinMatch } = useArena();

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quiz Arena</h1>
          {!currentMatch && (
            <Button onClick={joinMatch} disabled={isLoading}>
              <Users className="mr-2 h-4 w-4" />
              Join Match
            </Button>
          )}
        </div>

        {currentMatch ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Status: {currentMatch.status}</h3>
                    <p className="text-sm text-muted-foreground">
                      Players: {players.length}/4
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Welcome to Quiz Arena
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join a match to compete with other players in real-time quiz battles!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Arena;
