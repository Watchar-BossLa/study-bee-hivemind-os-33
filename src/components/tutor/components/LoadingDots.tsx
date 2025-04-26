
import React from 'react';

export const LoadingDots = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" 
           style={{ animationDelay: '0ms' }}></div>
      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" 
           style={{ animationDelay: '150ms' }}></div>
      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" 
           style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};
