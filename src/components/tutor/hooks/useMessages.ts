
import { useState } from 'react';
import { MessageType } from '../types/chat';

const initialMessages: MessageType[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI tutor powered by QuorumForge. I can help you understand various subjects using specialized AI agents and a knowledge graph to provide context-rich explanations. What would you like to learn about today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 60000),
    modelUsed: 'QuorumForge OS',
  },
];

export const useMessages = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const addMessage = (message: MessageType) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (messageId: string, updates: Partial<MessageType>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  return {
    messages,
    input,
    isLoading,
    processingProgress,
    setInput,
    setIsLoading,
    setProcessingProgress,
    addMessage,
    updateMessage,
    setMessages
  };
};
