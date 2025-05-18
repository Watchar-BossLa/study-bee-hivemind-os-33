
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LiveSession } from '@/types/livesessions';

interface CreateSessionFormProps {
  onSessionCreated: (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => void;
  disabled?: boolean;
}

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Literature', 'History', 'Geography', 'Economics', 'Psychology',
  'Business', 'Law', 'Medicine', 'Engineering', 'Arts', 'Music',
  'Languages', 'Philosophy', 'Political Science', 'Sociology'
];

const CreateSessionForm: React.FC<CreateSessionFormProps> = ({ onSessionCreated, disabled = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [features, setFeatures] = useState({
    video: true,
    audio: true,
    chat: true,
    whiteboard: true,
    screenSharing: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'> = {
      title,
      description: description || undefined,
      subject,
      maxParticipants,
      startTime: new Date().toISOString(),
      status: 'active',
      isPrivate,
      accessCode: isPrivate ? accessCode : undefined,
      features
    };
    
    onSessionCreated(sessionData);
  };

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Study Session</CardTitle>
        <CardDescription>
          Set up a new collaborative study session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              placeholder="e.g., Biology Final Exam Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={disabled}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what will be covered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={disabled}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              required
              disabled={disabled}
            >
              <option value="">Select a subject</option>
              {SUBJECTS.map((subj) => (
                <option key={subj} value={subj.toLowerCase()}>{subj}</option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-participants">Maximum Participants</Label>
            <Input
              id="max-participants"
              type="number"
              min="2"
              max="20"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              required
              disabled={disabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="private-session">Private Session</Label>
            <Switch
              id="private-session"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={disabled}
            />
          </div>
          
          {isPrivate && (
            <div className="space-y-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                placeholder="Enter a code to share with participants"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required={isPrivate}
                disabled={disabled}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="feature-video">Video</Label>
                <Switch
                  id="feature-video"
                  checked={features.video}
                  onCheckedChange={() => toggleFeature('video')}
                  disabled={disabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="feature-audio">Audio</Label>
                <Switch
                  id="feature-audio"
                  checked={features.audio}
                  onCheckedChange={() => toggleFeature('audio')}
                  disabled={disabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="feature-chat">Chat</Label>
                <Switch
                  id="feature-chat"
                  checked={features.chat}
                  onCheckedChange={() => toggleFeature('chat')}
                  disabled={disabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="feature-whiteboard">Whiteboard</Label>
                <Switch
                  id="feature-whiteboard"
                  checked={features.whiteboard}
                  onCheckedChange={() => toggleFeature('whiteboard')}
                  disabled={disabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="feature-screen">Screen Sharing</Label>
                <Switch
                  id="feature-screen"
                  checked={features.screenSharing}
                  onCheckedChange={() => toggleFeature('screenSharing')}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!title || !subject || disabled}
          >
            Create Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateSessionForm;
