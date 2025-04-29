
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionMessage } from '@/types/livesessions';
import { Send } from 'lucide-react';

interface SessionChatProps {
  sessionId: string;
}

const SessionChat: React.FC<SessionChatProps> = ({ sessionId }) => {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulate initial messages
  useEffect(() => {
    setMessages([
      {
        id: '1',
        sessionId,
        userId: 'system',
        userName: 'System',
        content: 'Welcome to the study session! Please be respectful to all participants.',
        type: 'system',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        sessionId,
        userId: 'user-2',
        userName: 'Sarah',
        content: 'Hi everyone! Ready to study?',
        type: 'text',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
    ]);
  }, [sessionId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message: SessionMessage = {
      id: Date.now().toString(),
      sessionId,
      userId: 'current-user-id',
      userName: 'You',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto bg-background">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.userId === 'current-user-id' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === 'system' 
                    ? 'bg-gray-100 dark:bg-gray-800 text-center w-full text-sm italic' 
                    : message.userId === 'current-user-id'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                }`}
              >
                {message.userId !== 'current-user-id' && message.type !== 'system' && (
                  <p className="text-xs font-medium mb-1">{message.userName}</p>
                )}
                <p>{message.content}</p>
                <p className="text-xs opacity-70 text-right mt-1">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default SessionChat;
