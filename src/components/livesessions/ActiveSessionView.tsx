
import React, { useState } from 'react';
import { LiveSession, SessionMessage } from '@/types/livesessions';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionChat from './SessionChat';
import SessionWhiteboard from './SessionWhiteboard';
import SessionParticipants from './SessionParticipants';
import SessionNotes from './SessionNotes';
import { Video, Users, MessageSquare, PenTool, FileText, ScreenShare } from 'lucide-react';

interface ActiveSessionViewProps {
  session: LiveSession;
  onLeave: () => void;
}

const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ session, onLeave }) => {
  const [showVideo, setShowVideo] = useState(true);
  const [showScreenShare, setShowScreenShare] = useState(false);

  const toggleScreenShare = () => {
    setShowScreenShare(!showScreenShare);
    if (!showScreenShare) {
      setShowVideo(false);
    }
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
    if (!showVideo) {
      setShowScreenShare(false);
    }
  };

  return (
    <div className="container py-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{session.title}</h1>
          <p className="text-muted-foreground">{session.subject}</p>
        </div>
        
        <Button variant="destructive" onClick={onLeave}>Leave Session</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Main content area - Video/Screen and Tools */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Video/Screen area */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" 
               style={{ height: 'calc(100% - 12rem)' }}>
            {showVideo && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 h-full">
                {[...Array(Math.min(session.participants.length, 6))].map((_, idx) => (
                  <div key={idx} className="bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                        {session.participants[idx]?.name.charAt(0)}
                      </div>
                      <p className="text-sm mt-2">{session.participants[idx]?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showScreenShare && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <ScreenShare size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p>Screen sharing is active</p>
                </div>
              </div>
            )}
            
            {!showVideo && !showScreenShare && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Video size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p>Video is turned off</p>
                  <Button variant="outline" onClick={toggleVideo} className="mt-4">
                    Turn On Video
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Session tools */}
          <div className="mt-4">
            <Tabs defaultValue="whiteboard">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="whiteboard">
                    <PenTool className="h-4 w-4 mr-2" />
                    Whiteboard
                  </TabsTrigger>
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    <FileText className="h-4 w-4 mr-2" />
                    Notes
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={showVideo ? "default" : "outline"} 
                    onClick={toggleVideo}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {showVideo ? "Hide Video" : "Show Video"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant={showScreenShare ? "default" : "outline"} 
                    onClick={toggleScreenShare}
                  >
                    <ScreenShare className="h-4 w-4 mr-2" />
                    {showScreenShare ? "Stop Sharing" : "Share Screen"}
                  </Button>
                </div>
              </div>
              
              <TabsContent value="whiteboard" className="h-64">
                <SessionWhiteboard sessionId={session.id} />
              </TabsContent>
              
              <TabsContent value="chat" className="h-64">
                <SessionChat sessionId={session.id} />
              </TabsContent>
              
              <TabsContent value="notes" className="h-64">
                <SessionNotes sessionId={session.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Sidebar - Participants */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg h-full overflow-hidden">
            <div className="p-4 border-b flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <h3 className="font-medium">Participants ({session.participants.length}/{session.maxParticipants})</h3>
            </div>
            <SessionParticipants participants={session.participants} hostId={session.host.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionView;
