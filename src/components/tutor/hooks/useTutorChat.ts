
import { useState, useCallback } from 'react';
import { MessageType } from '../types/chat';
import { quorumForge } from '../services/QuorumForge';

const initialMessages: MessageType[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI tutor powered by QuorumForge. I can help you understand various subjects using specialized AI agents and a knowledge graph to provide context-rich explanations. What would you like to learn about today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 60000),
    modelUsed: 'QuorumForge OS',
  },
];

export const useTutorChat = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
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

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    setProcessingProgress(0);

    try {
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Get response from QuorumForge
      const result = await quorumForge.processQuery(userMessage.content);

      clearInterval(progressInterval);
      setProcessingProgress(100);

      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        role: 'assistant',
        timestamp: new Date(),
        modelUsed: 'QuorumForge OS',
        agentContributors: result.agentContributions.map(contrib => contrib.agentId),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        modelUsed: 'Error Handler',
      };

      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setProcessingProgress(0);
    }
  }, [input, isLoading, addMessage]);

  return {
    messages,
    input,
    isLoading,
    processingProgress,
    setInput,
    handleSend,
    addMessage,
    updateMessage
  };
};
