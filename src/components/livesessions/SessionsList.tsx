
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLiveSessions } from '@/hooks/useLiveSessions';
import { LiveSession } from '@/types/livesessions';
import { Calendar, Clock, Users, Video, MessageSquare } from 'lucide-react';

interface SessionsListProps {
  onJoinSession: (session: LiveSession) => void;
}

const SessionsList: React.FC<SessionsListProps> = ({ onJoinSession }) => {
  const { sessions, isLoading, error } = useLiveSessions();
  
  if (isLoading) {
    return <div className="flex justify-center py-10">Loading sessions...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 py-10">Error loading sessions: {error}</div>;
  }
  
  if (!sessions || sessions.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No active sessions found.</p>
          <p className="mt-2">Be the first to create a study session!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Sessions</h2>
        <span className="text-muted-foreground">{sessions.length} sessions found</span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{session.title}</CardTitle>
                <Badge variant={session.status === 'active' ? "default" : "secondary"}>
                  {session.status === 'active' ? 'Live' : 'Scheduled'}
                </Badge>
              </div>
              <CardDescription>{session.subject}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(session.startTime).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(session.startTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{session.participants.length} / {session.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {session.features.video && <Video className="h-4 w-4" />}
                  {session.features.chat && <MessageSquare className="h-4 w-4" />}
                  {session.features.whiteboard && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Host: {session.host.name}
              </span>
              <Button 
                size="sm" 
                onClick={() => onJoinSession(session)}
                disabled={session.participants.length >= session.maxParticipants}
              >
                Join
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionsList;
