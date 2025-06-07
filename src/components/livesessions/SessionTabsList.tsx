
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText, MessageSquare, Pencil, Users, PieChart } from 'lucide-react';
import { LiveSession } from '@/types/livesessions';

interface SessionTabsListProps {
  session: LiveSession;
}

const SessionTabsList: React.FC<SessionTabsListProps> = ({ session }) => {
  return (
    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
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
      
      <TabsTrigger value="polls">
        <PieChart className="mr-2 h-4 w-4" />
        <span className="hidden md:inline">Polls</span>
      </TabsTrigger>
      
      <TabsTrigger value="analytics">
        <BarChart3 className="mr-2 h-4 w-4" />
        <span className="hidden md:inline">Analytics</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default SessionTabsList;
