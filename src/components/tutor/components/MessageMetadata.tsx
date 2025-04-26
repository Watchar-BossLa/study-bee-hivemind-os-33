
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageType } from '../types/chat';

interface MessageMetadataProps {
  message: MessageType;
}

export const MessageMetadata = ({ message }: MessageMetadataProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {message.modelUsed && (
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
      
      {message.relatedTopics && message.relatedTopics.length > 0 && (
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
    </>
  );
};
