
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText, MessageSquare, Pencil, Users, PieChart } from 'lucide-react';
import { LiveSession } from '@/types/livesessions';

interface SessionTabsListProps {
  session: LiveSession;
}

const SessionTabsList: React.FC<SessionTabsListProps> = ({ session }) => {
  // Calculate which tabs are active
  const activeTabs = [];
  
  if (session.features.whiteboard) activeTabs.push('whiteboard');
  if (session.features.chat) activeTabs.push('chat');
  activeTabs.push('notes', 'participants', 'polls', 'analytics');
  
  // Use fixed grid classes based on number of tabs
  const getGridClass = (tabCount: number) => {
    switch (tabCount) {
      case 4: return 'grid w-full grid-cols-4';
      case 5: return 'grid w-full grid-cols-5';
      case 6: return 'grid w-full grid-cols-6';
      default: return 'grid w-full grid-cols-6';
    }
  };

  return (
    <TabsList className={getGridClass(activeTabs.length)}>
      {session.features.whiteboard && (
        <TabsTrigger value="whiteboard" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          <span className="hidden md:inline">Whiteboard</span>
        </TabsTrigger>
      )}
      
      {session.features.chat && (
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden md:inline">Chat</span>
        </TabsTrigger>
      )}
      
      <TabsTrigger value="notes" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <span className="hidden md:inline">Notes</span>
      </TabsTrigger>
      
      <TabsTrigger value="participants" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden md:inline">Participants</span>
      </TabsTrigger>
      
      <TabsTrigger value="polls" className="flex items-center gap-2">
        <PieChart className="h-4 w-4" />
        <span className="hidden md:inline">Polls</span>
      </TabsTrigger>
      
      <TabsTrigger value="analytics" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span className="hidden md:inline">Analytics</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default SessionTabsList;
