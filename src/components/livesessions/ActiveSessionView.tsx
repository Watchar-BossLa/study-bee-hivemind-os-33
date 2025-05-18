
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveSession } from '@/types/livesessions';
import SessionChat from './SessionChat';
import SessionWhiteboard from './SessionWhiteboard';
import SessionNotes from './SessionNotes';
import SessionParticipants from './SessionParticipants';
import SessionAnalytics from './SessionAnalytics';
import { BarChart3, MessageSquare, Pencil, FileText, Users } from 'lucide-react';

interface ActiveSessionViewProps {
  session: LiveSession;
  onLeave: () => void;
}

const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ session, onLeave }) => {
  const [activeTab, setActiveTab] = useState<string>('whiteboard');

  return (
    <div className="container py-4">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
          {session.features.whiteboard && (
            <TabsTrigger value="whiteboard">
              <Pencil className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Whiteboard</span>
            </TabsTrigger>
          )}
          
          {session.features.chat && (
            <TabsTrigger value="chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden md:inline">Chat</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="notes">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Notes</span>
          </TabsTrigger>
          
          <TabsTrigger value="participants">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Participants</span>
          </TabsTrigger>
          
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        {session.features.whiteboard && (
          <TabsContent value="whiteboard" className="border-none p-0">
            <SessionWhiteboard sessionId={session.id} />
          </TabsContent>
        )}
        
        {session.features.chat && (
          <TabsContent value="chat" className="border-none p-0">
            <SessionChat sessionId={session.id} />
          </TabsContent>
        )}
        
        <TabsContent value="notes" className="border-none p-0">
          <SessionNotes sessionId={session.id} />
        </TabsContent>
        
        <TabsContent value="participants" className="border-none p-0">
          <SessionParticipants sessionId={session.id} participants={session.participants} host={session.host} />
        </TabsContent>
        
        <TabsContent value="analytics" className="border-none p-0">
          <SessionAnalytics sessionId={session.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActiveSessionView;
