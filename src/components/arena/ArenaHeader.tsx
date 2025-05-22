
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArenaSubjectSelect } from './ArenaSubjectSelect';
import { ArenaMatch } from '@/types/arena';
import { Loader2, Users, Trophy } from 'lucide-react';

interface ArenaHeaderProps {
  isLoading: boolean;
  currentMatch: ArenaMatch | null;
  selectedSubject: string | null;
  onSelectSubject: (subject: string) => void;
  onJoinMatch: () => void;
  onLeaveMatch: () => void;
}

export const ArenaHeader: React.FC<ArenaHeaderProps> = ({
  isLoading,
  currentMatch,
  selectedSubject,
  onSelectSubject,
  onJoinMatch,
  onLeaveMatch
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quiz Arena</h1>
        <p className="text-muted-foreground">Compete with other students in real-time quiz battles</p>
      </div>
      
      <div className="flex items-center gap-4">
        {!currentMatch ? (
          <>
            <ArenaSubjectSelect 
              selectedSubject={selectedSubject} 
              onSelectSubject={onSelectSubject}
              disabled={isLoading} 
            />
            <Button 
              onClick={onJoinMatch} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  Join Match
                </>
              )}
            </Button>
          </>
        ) : (
          <Button 
            onClick={onLeaveMatch} 
            variant="outline"
          >
            Leave Match
          </Button>
        )}
      </div>
    </div>
  );
};
