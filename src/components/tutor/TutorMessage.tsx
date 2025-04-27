
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { MessageType } from './types/chat';
import { MessageMetadata } from './components/MessageMetadata';
import { MessageContent } from './components/MessageContent';

interface TutorMessageProps {
  message: MessageType;
}

const TutorMessage: React.FC<TutorMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 group",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </Avatar>
      )}
      
      <MessageContent message={message} isUser={isUser} />
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
};

export default TutorMessage;
