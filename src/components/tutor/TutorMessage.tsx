
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  modelUsed?: string;
  loading?: boolean;
  relatedTopics?: string[];
};

interface TutorMessageProps {
  message: MessageType;
}

const TutorMessage: React.FC<TutorMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Format timestamp to display in a readable format
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
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
      
      <div className={cn(
        "rounded-lg p-3 max-w-[85%]",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {message.loading ? (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        ) : (
          <div className="space-y-2">
            <div>{message.content}</div>
            
            {!isUser && message.modelUsed && (
              <div className="flex flex-wrap justify-between items-center mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <span className="mr-1">Model:</span>
                  <Badge variant="outline" className="text-xs h-5">
                    {message.modelUsed}
                  </Badge>
                </div>
                <span className="text-xs">{formatTime(message.timestamp)}</span>
              </div>
            )}
            
            {!isUser && message.relatedTopics && message.relatedTopics.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Related topics:</p>
                <div className="flex flex-wrap gap-1">
                  {message.relatedTopics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
};

export default TutorMessage;
