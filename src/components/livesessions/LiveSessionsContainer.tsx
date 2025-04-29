
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionsList from './SessionsList';
import CreateSessionForm from './CreateSessionForm';
import JoinSessionForm from './JoinSessionForm';
import ActiveSessionView from './ActiveSessionView';
import { LiveSession } from '@/types/livesessions';
import { useToast } from "@/components/ui/use-toast";

const LiveSessionsContainer = () => {
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const { toast } = useToast();
  
  const handleJoinSession = (session: LiveSession) => {
    setActiveSession(session);
    toast({
      title: "Session joined",
      description: `You've joined ${session.title}`,
    });
  };
  
  const handleCreateSession = (session: LiveSession) => {
    setActiveSession(session);
    toast({
      title: "Session created",
      description: "Your study session has been created successfully",
    });
  };
  
  const handleLeaveSession = () => {
    setActiveSession(null);
    toast({
      title: "Session left",
      description: "You've left the study session",
    });
  };

  if (activeSession) {
    return <ActiveSessionView session={activeSession} onLeave={handleLeaveSession} />;
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Live Study Sessions</h1>
      
      <Tabs defaultValue="join" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="join">Join Session</TabsTrigger>
          <TabsTrigger value="browse">Browse Sessions</TabsTrigger>
          <TabsTrigger value="create">Create Session</TabsTrigger>
        </TabsList>
        
        <TabsContent value="join" className="mt-6">
          <JoinSessionForm onJoin={handleJoinSession} />
        </TabsContent>
        
        <TabsContent value="browse" className="mt-6">
          <SessionsList onJoinSession={handleJoinSession} />
        </TabsContent>
        
        <TabsContent value="create" className="mt-6">
          <CreateSessionForm onSessionCreated={handleCreateSession} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveSessionsContainer;
