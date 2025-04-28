
import { useState, useEffect, useCallback } from 'react';
import { quorumForge } from '../services/QuorumForge';
import { llmRouter } from '../services/LLMRouter';
import { useSkillLevelAssessment } from './useSkillLevelAssessment';
import { useChatMetadata } from './useChatMetadata';
import { useMessages } from './useMessages';
import { useProcessingSimulation } from './useProcessingSimulation';
import { useFeedbackHandler } from './useFeedbackHandler';
import { useCompletion } from './useCompletion';

export const useTutorChat = () => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const [modelPerformance, setModelPerformance] = useState<Map<string, any>>(new Map());
  const [agentPerformance, setAgentPerformance] = useState<Map<string, any>>(new Map());
  
  const { skillLevel, assessSkillLevel } = useSkillLevelAssessment();
  const { metadata, updateMetadata, addTopic, updateModelUse } = useChatMetadata();
  const { 
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
  } = useMessages();

  const { completeResponse } = useCompletion(
    messages,
    updateMessage,
    updateMetadata,
    addTopic,
    updateModelUse,
    setIsLoading,
    setProcessingProgress,
    activePath,
    metadata
  );

  const { simulateProcessing } = useProcessingSimulation(setProcessingProgress, completeResponse);
  const { handleResponseFeedback } = useFeedbackHandler(messages, setMessages);

  useEffect(() => {
    const updateModelPerformance = () => {
      setModelPerformance(llmRouter.getPerformanceMetrics());
      setAgentPerformance(quorumForge.getAllAgentPerformanceMetrics());
    };
    
    updateModelPerformance();
    const intervalId = setInterval(updateModelPerformance, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (messages.length > 6) {
      assessSkillLevel(messages);
    }
  }, [messages, assessSkillLevel]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user' as const,
      timestamp: new Date(),
    };
    
    const loadingMessage = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant' as const,
      timestamp: new Date(),
      loading: true,
    };
    
    addMessage(userMessage);
    addMessage(loadingMessage);
    setInput('');
    setIsLoading(true);
    simulateProcessing();
  };

  return {
    messages,
    input,
    isLoading,
    processingProgress,
    activePath,
    chatMetadata: metadata,
    modelPerformance,
    agentPerformance,
    setInput,
    handleSend,
    setActivePath,
    handleResponseFeedback
  };
};
