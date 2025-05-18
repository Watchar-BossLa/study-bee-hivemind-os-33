
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinSessionFormProps {
  onJoin: (sessionId: string, accessCode?: string) => void;
  disabled?: boolean;
}

const JoinSessionForm: React.FC<JoinSessionFormProps> = ({ onJoin, disabled = false }) => {
  const [sessionId, setSessionId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    onJoin(sessionId, isPrivate ? accessCode : undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join a Study Session</CardTitle>
        <CardDescription>
          Enter a session ID to join an existing study session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-id">Session ID</Label>
            <Input
              id="session-id"
              placeholder="Enter session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              disabled={disabled}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="private-session"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              className="rounded"
              disabled={disabled}
            />
            <Label htmlFor="private-session">This is a private session</Label>
          </div>
          
          {isPrivate && (
            <div className="space-y-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={disabled}
                required={isPrivate}
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={!sessionId || (isPrivate && !accessCode) || disabled}>
            Join Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JoinSessionForm;
