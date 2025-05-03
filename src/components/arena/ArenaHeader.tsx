
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Flag } from 'lucide-react';
import { ArenaSubjectSelect } from './ArenaSubjectSelect';
import { ArenaMatch } from '@/types/arena';

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
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Quiz Arena</h1>
      {!currentMatch ? (
        <div className="flex items-center gap-4">
          <ArenaSubjectSelect 
            selectedSubject={selectedSubject} 
            onSelectSubject={onSelectSubject}
          />
          <Button onClick={onJoinMatch} disabled={isLoading}>
            <Users className="mr-2 h-4 w-4" />
            Join Match
          </Button>
        </div>
      ) : (
        <Button onClick={onLeaveMatch} variant="outline">
          <Flag className="mr-2 h-4 w-4" />
          Leave Match
        </Button>
      )}
    </div>
  );
};
