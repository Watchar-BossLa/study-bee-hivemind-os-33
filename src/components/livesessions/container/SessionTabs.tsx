
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import JoinSessionTab from '../tabs/JoinSessionTab';
import BrowseSessionsTab from '../tabs/BrowseSessionsTab';
import CreateSessionTab from '../tabs/CreateSessionTab';
import { LiveSession } from '@/types/livesessions';
import { useLiveSessions } from '@/hooks/useLiveSessions';

interface SessionTabsProps {
  isAuthenticated: boolean;
  onJoinSession?: (session: LiveSession) => Promise<any>;
  onJoinById?: (sessionId: string, accessCode?: string) => Promise<any>;
  onCreateSession?: (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => Promise<any>;
}

/**
 * Component that renders the session tabs UI
 */
const SessionTabs: React.FC<SessionTabsProps> = ({
  isAuthenticated,
  onJoinSession,
  onJoinById,
  onCreateSession
}) => {
  const { sessions, isLoading, error } = useLiveSessions();

  return (
    <Tabs defaultValue="browse" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="join" className="flex items-center gap-2">
          Join Session
        </TabsTrigger>
        <TabsTrigger value="browse" className="flex items-center gap-2">
          Browse Sessions
        </TabsTrigger>
        <TabsTrigger value="create" className="flex items-center gap-2">
          Create Session
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="join">
        <JoinSessionTab 
          onJoin={onJoinById || (() => Promise.resolve(null))} 
          disabled={!isAuthenticated} 
        />
      </TabsContent>
      
      <TabsContent value="browse">
        <BrowseSessionsTab 
          sessions={sessions}
          isLoading={isLoading} 
          error={error}
          onJoinSession={onJoinSession || (() => Promise.resolve(null))} 
          disabled={!isAuthenticated}
        />
      </TabsContent>
      
      <TabsContent value="create">
        <CreateSessionTab 
          onSessionCreated={onCreateSession || (() => Promise.resolve(null))} 
          disabled={!isAuthenticated} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default SessionTabs;
