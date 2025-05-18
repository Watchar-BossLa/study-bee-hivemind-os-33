
import React from 'react';
import { LiveSession } from '@/types/livesessions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Users, Calendar } from 'lucide-react';

interface SessionsListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onJoinSession: (session: LiveSession) => void;
  disabled?: boolean;
}

const SessionsList: React.FC<SessionsListProps> = ({ 
  sessions, 
  isLoading, 
  error, 
  onJoinSession,
  disabled = false
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <p className="text-red-500 mb-2">Error: {error}</p>
        <Button variant="outline">Retry</Button>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="mb-4">No active sessions available at the moment</p>
        <p className="text-muted-foreground">Create your own session or check back later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <Card key={session.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="truncate text-lg">{session.title}</CardTitle>
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(session.startTime).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="mb-2">
              <p className="font-semibold">Subject: {session.subject}</p>
              {session.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>
                  {session.participants.length}/{session.maxParticipants}
                </span>
              </div>
              <div>
                {session.isPrivate && (
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Private
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button 
              className="w-full" 
              onClick={() => onJoinSession(session)}
              disabled={disabled || session.participants.length >= session.maxParticipants}
            >
              Join Session
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SessionsList;
