
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';
import { useSessionChat } from '@/hooks/useSessionChat';
import { useToast } from "@/components/ui/use-toast";

interface SessionChatProps {
  sessionId: string;
}

const SessionChat: React.FC<SessionChatProps> = ({ sessionId }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, typingUsers, sendMessage, setTyping } = useSessionChat(sessionId);
  const { toast } = useToast();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
      setTyping(false);
    }
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
          
          {typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground italic">
              {typingUsers.map(user => user.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default SessionChat;
