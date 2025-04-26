
import React from 'react';
import { cn } from '@/lib/utils';
import { MessageType } from '../types/chat';
import { MessageMetadata } from './MessageMetadata';
import { LoadingDots } from './LoadingDots';

interface MessageContentProps {
  message: MessageType;
  isUser: boolean;
}

export const MessageContent = ({ message, isUser }: MessageContentProps) => {
  return (
    <div className={cn(
      "rounded-lg p-3 max-w-[85%]",
      isUser ? "bg-primary text-primary-foreground" : "bg-muted"
    )}>
      {message.loading ? (
        <LoadingDots />
      ) : (
        <div className="space-y-2">
          <div>{message.content}</div>
          {!isUser && <MessageMetadata message={message} />}
        </div>
      )}
    </div>
  );
};
