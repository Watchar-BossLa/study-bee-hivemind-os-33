
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { LiveSession } from '@/types/livesessions';
import SessionHeader from './SessionHeader';
import SessionTabsList from './SessionTabsList';
import SessionTabsContent from './SessionTabsContent';

interface ActiveSessionViewProps {
  session: LiveSession;
  onLeave: () => void;
}

const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ session, onLeave }) => {
  const [activeTab, setActiveTab] = useState<string>('whiteboard');

  return (
    <div className="container py-4">
      <SessionHeader session={session} onLeave={onLeave} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <SessionTabsList session={session} />
        <SessionTabsContent session={session} />
      </Tabs>
    </div>
  );
};

export default ActiveSessionView;
