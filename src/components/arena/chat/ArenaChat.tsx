
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import { useArenaChat } from '@/hooks/arena/useArenaChat';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessageItem } from './ChatMessageItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArenaChatProps {
  matchId: string | null;
  players: Array<{ user_id: string }>;
}

export const ArenaChat: React.FC<ArenaChatProps> = ({ matchId, players }) => {
  const { 
    messages, 
    typingUsers, 
    inputMessage, 
    isLoading, 
    handleInputChange, 
    sendMessage 
  } = useArenaChat(matchId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (matchId) {
      inputRef.current?.focus();
    }
  }, [matchId]);

  // Handle send on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!matchId) {
    return null;
  }

  // Get player IDs for filtering typing indicators
  const playerIds = players.map(p => p.user_id);
  
  // Only show typing indicators for players who are actually in the match
  const activeTypingUsers = typingUsers.filter(userId => 
    playerIds.includes(userId)
  );
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="px-4 py-2 border-b">
        <CardTitle className="text-sm font-medium flex items-center">
          <MessageCircle className="h-4 w-4 mr-2" />
          Match Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[300px] p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
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
            <div ref={messagesEndRef} />
          </div>
          {activeTypingUsers.length > 0 && (
            <TypingIndicator userIds={activeTypingUsers} />
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <div className="flex w-full gap-2">
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button 
            size="icon" 
            onClick={sendMessage} 
            disabled={isLoading || !inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
