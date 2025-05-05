
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArenaMatch, MatchPlayer } from '@/types/arena';
import { ArenaPlayers } from './ArenaPlayers';
import { Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArenaMatchWaitingProps {
  currentMatch: ArenaMatch;
  players: MatchPlayer[];
  className?: string;
}

export const ArenaMatchWaiting: React.FC<ArenaMatchWaitingProps> = ({ 
  currentMatch, 
  players,
  className 
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> 
            Waiting for Players
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="text-sm font-normal">{players.length} joined</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-4">
            <p className="text-lg mb-2">
              Waiting for more players to join...
            </p>
            <p className="text-sm text-muted-foreground">
              The match will start automatically when enough players join.
            </p>
          </div>
          
          {currentMatch.subject_focus && (
            <div className="mb-4 text-center">
              <span className="px-2 py-1 bg-muted rounded text-sm">
                {currentMatch.subject_focus}
              </span>
            </div>
          )}

          <ArenaPlayers players={players} />
        </div>
      </CardContent>
    </Card>
  );
};
