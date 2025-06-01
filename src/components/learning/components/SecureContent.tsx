
import React from 'react';
import { HTMLSanitizer } from '@/utils/htmlSanitizer';

interface SecureContentProps {
  content: string;
}

export const SecureContent: React.FC<SecureContentProps> = ({ content }) => {
  const sanitizedContent = HTMLSanitizer.validateAndSanitize(content);
  
  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
