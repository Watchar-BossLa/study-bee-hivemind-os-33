
import React from 'react';
import SessionsList from '../SessionsList';
import { LiveSession } from '@/types/livesessions';

interface BrowseSessionsTabProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onJoinSession: (session: LiveSession) => Promise<void>;
  disabled: boolean;
}

const BrowseSessionsTab: React.FC<BrowseSessionsTabProps> = ({ 
  sessions, 
  isLoading, 
  error, 
  onJoinSession, 
  disabled 
}) => {
  return (
    <div className="mt-6">
      <SessionsList 
        sessions={sessions}
        isLoading={isLoading} 
        error={error}
        onJoinSession={onJoinSession} 
        disabled={disabled}
      />
    </div>
  );
};

export default BrowseSessionsTab;
