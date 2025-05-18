
import React, { useState, useEffect } from 'react';
import { LiveSession } from '@/types/livesessions';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionChat from './SessionChat';
import SessionWhiteboard from './SessionWhiteboard';
import SessionParticipants from './SessionParticipants';
import SessionNotes from './SessionNotes';
import { Video, Users, MessageSquare, PenTool, FileText, ScreenShare, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";

interface ActiveSessionViewProps {
  session: LiveSession;
  onLeave: () => void;
}

const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ session, onLeave }) => {
  const [showVideo, setShowVideo] = useState(true);
  const [showScreenShare, setShowScreenShare] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [participantCount, setParticipantCount] = useState(session.participants.length);
  const { toast } = useToast();

  // Check if current user is the host
  useEffect(() => {
    const checkHostStatus = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setIsHost(data.user.id === session.host.id);
      }
    };
    
    checkHostStatus();
  }, [session.host.id]);
  
  // Subscribe to participant changes
  useEffect(() => {
    const channel = supabase
      .channel(`participants-${session.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'session_participants',
          filter: `session_id=eq.${session.id}`
        }, 
        (payload) => {
          // Refresh participant count
          const getParticipantCount = async () => {
            const { data } = await supabase
              .from('session_participants')
              .select('id')
              .eq('session_id', session.id)
              .eq('is_active', true);
            
            if (data) {
              setParticipantCount(data.length);
            }
          };
          
          getParticipantCount();
          
          // Show notification for new participants
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New participant",
              description: "Someone has joined the session"
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id, toast]);

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
  
  const handleEndSession = async () => {
    if (!isHost) return;
    
    try {
      // Update session status to ended
      const { error } = await supabase
        .from('live_sessions')
        .update({
          status: 'ended',
          end_time: new Date().toISOString()
        })
        .eq('id', session.id);
        
      if (error) throw error;
      
      toast({
        title: "Session ended",
        description: "You've ended the study session"
      });
      
      onLeave();
    } catch (err) {
      console.error("Error ending session:", err);
      toast({
        variant: "destructive",
        title: "Error ending session",
        description: "Failed to end session"
      });
    }
  };

  return (
    <div className="container py-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{session.title}</h1>
            {isHost && <Badge variant="outline">Host</Badge>}
          </div>
          <p className="text-muted-foreground">{session.subject}</p>
        </div>
        
        <div className="flex gap-2">
          {isHost && (
            <Button variant="destructive" onClick={handleEndSession}>
              <AlertCircle className="mr-2 h-4 w-4" />
              End Session
            </Button>
          )}
          <Button variant={isHost ? "outline" : "destructive"} onClick={onLeave}>Leave Session</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Main content area - Video/Screen and Tools */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Video/Screen area */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" 
               style={{ height: 'calc(100% - 12rem)' }}>
            {showVideo && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 h-full">
                {[...Array(Math.min(participantCount, 6))].map((_, idx) => (
                  <div key={idx} className="bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                        {session.participants[idx]?.name?.charAt(0) || '?'}
                      </div>
                      <p className="text-sm mt-2">{session.participants[idx]?.name || 'Loading...'}</p>
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
              <h3 className="font-medium">Participants ({participantCount}/{session.maxParticipants})</h3>
            </div>
            <SessionParticipants participants={session.participants} hostId={session.host.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionView;
