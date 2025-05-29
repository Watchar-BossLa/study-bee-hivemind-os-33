
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { LiveSession } from '@/types/livesessions';
import SessionChat from './SessionChat';
import SessionWhiteboard from './SessionWhiteboard';
import SessionNotes from './SessionNotes';
import SessionParticipants from './SessionParticipants';
import SessionAnalytics from './SessionAnalytics';
import SessionPoll from './SessionPoll';

interface SessionTabsContentProps {
  session: LiveSession;
}

const SessionTabsContent: React.FC<SessionTabsContentProps> = ({ session }) => {
  return (
    <>
      {session.features.whiteboard && (
        <TabsContent value="whiteboard" className="border-none p-0">
          <SessionWhiteboard sessionId={session.id} />
        </TabsContent>
      )}
      
      {session.features.chat && (
        <TabsContent value="chat" className="border-none p-0">
          <SessionChat session={session} />
        </TabsContent>
      )}
      
      <TabsContent value="notes" className="border-none p-0">
        <SessionNotes sessionId={session.id} />
      </TabsContent>
      
      <TabsContent value="participants" className="border-none p-0">
        <SessionParticipants 
          sessionId={session.id} 
          participants={session.participants} 
          host={session.host} 
        />
      </TabsContent>
      
      <TabsContent value="polls" className="border-none p-0">
        <SessionPoll session={session} />
      </TabsContent>
      
      <TabsContent value="analytics" className="border-none p-0">
        <SessionAnalytics sessionId={session.id} />
      </TabsContent>
    </>
  );
};

export default SessionTabsContent;
