
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { ChatMessageItem } from './ChatMessageItem';
import { TypingIndicator } from './TypingIndicator';
import { useArenaChat } from '@/hooks/arena/useArenaChat';
import type { MatchPlayer } from '@/types/arena';

interface ArenaChatProps {
  matchId: string | null;
  players: MatchPlayer[];
}

const ArenaChat: React.FC<ArenaChatProps> = ({ matchId, players }) => {
  const { 
    messages, 
    typingUsers, 
    inputMessage, 
    isLoading, 
    handleInputChange, 
    sendMessage, 
    cleanupChat 
  } = useArenaChat(matchId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Clean up when component unmounts or match changes
  useEffect(() => {
    return () => {
      cleanupChat();
    };
  }, [cleanupChat]);
  
  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 py-2 border-b">
        <CardTitle className="flex items-center text-md">
          <MessageSquare className="mr-2 h-5 w-5" />
          Match Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Be the first to say something!
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem 
              key={message.id} 
              message={message} 
              players={players} 
            />
          ))
        )}
        
        {typingUsers.length > 0 && (
          <TypingIndicator userIds={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-2">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading || !matchId}
            className="flex-1"
          />
          <Button 
            type="submit"
            size="icon"
            disabled={isLoading || !inputMessage.trim() || !matchId}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ArenaChat;
