
import React from 'react';
import { User } from 'lucide-react';

interface TypingIndicatorProps {
  userIds: string[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userIds }) => {
  if (userIds.length === 0) return null;
  
  const displayText = () => {
    const count = userIds.length;
    
    if (count === 1) {
      return `Player ${userIds[0].substring(0, 6)} is typing...`;
    } else if (count === 2) {
      return `Player ${userIds[0].substring(0, 6)} and Player ${userIds[1].substring(0, 6)} are typing...`;
    } else {
      return `${count} players are typing...`;
    }
  };
  
  return (
    <div className="flex items-center gap-2 py-1 px-2 text-xs text-muted-foreground">
      <User className="h-3 w-3" />
      <span>{displayText()}</span>
      <div className="flex gap-1">
        <span className="animate-bounce delay-0">.</span>
        <span className="animate-bounce delay-150">.</span>
        <span className="animate-bounce delay-300">.</span>
      </div>
    </div>
  );
};
