
import React from 'react';
import { LiveSession } from '@/types/livesessions';
import { Tabs } from '@/components/ui/tabs';
import SessionHeader from './SessionHeader';
import SessionTabsList from './SessionTabsList';
import SessionTabsContent from './SessionTabsContent';

interface ActiveSessionViewProps {
  session: LiveSession;
  onLeaveSession: () => Promise<void>;
}

const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ 
  session, 
  onLeaveSession
}) => {
  return (
    <div className="space-y-4">
      <SessionHeader 
        session={session} 
        onLeaveSession={onLeaveSession} // Passing the correct prop name
      />
      
      <Tabs defaultValue="chat" className="w-full">
        <SessionTabsList session={session} />
        <div className="mt-4">
          <SessionTabsContent session={session} />
        </div>
      </Tabs>
    </div>
  );
};

export default ActiveSessionView;
