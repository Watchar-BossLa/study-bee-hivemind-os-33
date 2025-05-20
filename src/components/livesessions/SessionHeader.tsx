
import React from 'react';
import { Button } from '@/components/ui/button';
import { LiveSession } from '@/types/livesessions';

interface SessionHeaderProps {
  session: LiveSession;
  onLeaveSession: () => Promise<void>; // Changed from onLeave to onLeaveSession
}

const SessionHeader: React.FC<SessionHeaderProps> = ({ session, onLeaveSession }) => { // Updated parameter name
  return (
    <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold">{session.title}</h1>
        {session.description && (
          <p className="text-muted-foreground">{session.description}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onLeaveSession}>Leave Session</Button> {/* Updated onClick handler */}
      </div>
    </div>
  );
};

export default SessionHeader;
