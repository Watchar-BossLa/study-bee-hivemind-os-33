
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageType } from '../types/chat';
import { MessageMetadata } from './MessageMetadata';

interface MessageContentProps {
  message: MessageType;
  isUser: boolean;
}

export const MessageContent: React.FC<MessageContentProps> = ({ message, isUser }) => {
  return (
    <Card className={cn(
      "bg-background relative",
      isUser ? "border-primary/20" : "border-secondary/20",
      message.loading && "animate-pulse"
    )}>
      <CardContent className="p-3">
        <div className="text-sm">
          {message.content}
          
          {/* Show related topics as badges if available */}
          {message.relatedTopics && message.relatedTopics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.relatedTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          {/* Show contributing agents if available */}
          {message.agentContributors && message.agentContributors.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Contributing agents: </span>
              {message.agentContributors.map((agent, index) => (
                <React.Fragment key={index}>
                  <Badge variant="secondary" className="text-xs mr-1">
                    {agent}
                  </Badge>
                  {index < message.agentContributors!.length - 1 && ' '}
                </React.Fragment>
              ))}
            </div>
          )}
          
          <MessageMetadata message={message} />
        </div>
      </CardContent>
    </Card>
  );
};
