
import { useState, useCallback } from 'react';
import { MessageType } from '@/components/tutor/types/chat';

export interface TutorState {
  messages: MessageType[];
  input: string;
  isLoading: boolean;
  processingProgress: number;
}

export const useTutorState = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI tutor powered by QuorumForge. I can help you understand various subjects using specialized AI agents and a knowledge graph to provide context-rich explanations. What would you like to learn about today?',
      role: 'assistant',
      timestamp: new Date(Date.now() - 60000),
      modelUsed: 'QuorumForge OS',
    },
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const addMessage = useCallback((message: MessageType) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<MessageType>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  const clearInput = useCallback(() => {
    setInput('');
  }, []);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setProcessingProgress(0);
    }
  }, []);

  return {
    // State
    messages,
    input,
    isLoading,
    processingProgress,
    
    // Actions
    setInput,
    addMessage,
    updateMessage,
    clearInput,
    setLoadingState,
    setProcessingProgress
  };
};
