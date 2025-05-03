
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { ArenaPlayers } from './ArenaPlayers';
import { MatchPlayer, ArenaMatch } from '@/types/arena';
import { subjectAreas } from '@/data/qualifications';

interface ArenaMatchWaitingProps {
  currentMatch: ArenaMatch;
  players: MatchPlayer[];
}

export const ArenaMatchWaiting: React.FC<ArenaMatchWaitingProps> = ({ 
  currentMatch, 
  players 
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Waiting for Players</CardTitle>
          <CardDescription>
            {players.length} / 4 players have joined
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              The match will start automatically when enough players join
            </p>
            {/* Only render subject focus if the property exists */}
            {currentMatch.subject_focus && (
              <p className="mt-4 text-sm font-medium">
                Subject: {subjectAreas.find(s => s.id === currentMatch.subject_focus)?.name || currentMatch.subject_focus}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <ArenaPlayers players={players} />
    </>
  );
};
