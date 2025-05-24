
import { useState, useCallback, useRef } from 'react';
import { Message } from '../types/agents';

export const useTutorChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swarmMetrics, setSwarmMetrics] = useState<Map<string, any>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
    );
  }, []);

  const sendMessage = useCallback(async (content: string, metadata?: Record<string, any>) => {
    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      metadata
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      // Abort any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: `I understand your question: "${content}". Let me help you with that.`,
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          council: 'tutor',
          confidence: 0.9
        }
      };

      addMessage(aiMessage);

      // Update swarm metrics with new data
      setSwarmMetrics(prev => {
        const newMetrics = new Map(prev);
        newMetrics.set('lastUpdate', Date.now());
        newMetrics.set('totalMessages', messages.length + 2);
        return newMetrics;
      });

    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: 'Sorry, I encountered an error while processing your message.',
          role: 'assistant',
          timestamp: new Date(),
          metadata: { error: true }
        };
        addMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, messages.length]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setSwarmMetrics(new Map());
  }, []);

  return {
    messages,
    isLoading,
    swarmMetrics,
    sendMessage,
    addMessage,
    updateMessage,
    clearMessages
  };
};
