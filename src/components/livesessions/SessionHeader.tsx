
import React from 'react';
import { Button } from '@/components/ui/button';
import { LiveSession } from '@/types/livesessions';

interface SessionHeaderProps {
  session: LiveSession;
  onLeave: () => void;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ session, onLeave }) => {
  return (
    <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold">{session.title}</h1>
        {session.description && (
          <p className="text-muted-foreground">{session.description}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onLeave}>Leave Session</Button>
      </div>
    </div>
  );
};

export default SessionHeader;
