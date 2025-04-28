import { useCallback } from 'react';
import { MessageType } from '../types/chat';
import { RouterRequest } from '../types/router';
import { llmRouter } from '../services/LLMRouter';
import { quorumForge } from '../services/QuorumForge';
import { useToast } from '@/hooks/use-toast';

export const useFeedbackHandler = (
  messages: MessageType[],
  setMessages: (messages: MessageType[]) => void
) => {
  const { toast } = useToast();

  const handleResponseFeedback = useCallback((messageId: string, rating: number) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.modelUsed) return;
    
    const routerRequest: RouterRequest = {
      query: message.content || '',
      task: 'tutor',
      complexity: (message.complexity as 'low' | 'medium' | 'high') || 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    llmRouter.logSelection(message.modelUsed, routerRequest, rating > 3, message.processingTime, rating);
    
    if (message.agentContributors?.length && message.agentAnalysis?.confidenceScores) {
      const agentFeedback: Record<string, number> = {};
      message.agentContributors.forEach(agentName => {
        agentFeedback[agentName] = rating;
      });
      
      quorumForge.recordFeedback(
        message.id,
        'user-123',
        rating,
        agentFeedback
      );
    }
    
    setMessages((prevMessages: MessageType[]) => 
      prevMessages.map(m => 
        m.id === messageId ? 
          { ...m, userRating: rating, requestFeedback: false } : 
          m
      )
    );
    
    toast({
      title: "Feedback Recorded",
      description: "Thank you for your feedback! It helps improve our agents and responses.",
    });
  }, [messages, setMessages, toast]);

  return { handleResponseFeedback };
};
