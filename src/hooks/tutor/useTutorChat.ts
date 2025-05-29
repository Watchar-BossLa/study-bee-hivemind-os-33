
import { useCallback } from 'react';
import { useTutorState } from './useTutorState';
import { useTutorOperations } from './useTutorOperations';
import { MessageType } from '@/components/tutor/types/chat';

export const useTutorChat = () => {
  const {
    messages,
    input,
    isLoading,
    processingProgress,
    setInput,
    addMessage,
    updateMessage,
    clearInput,
    setLoadingState,
    setProcessingProgress
  } = useTutorState();

  const { processMessage, recordFeedback } = useTutorOperations();

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    addMessage(userMessage);
    clearInput();
    setLoadingState(true);

    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const assistantMessage = await processMessage(userMessage.content);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (assistantMessage) {
        addMessage(assistantMessage);
      }
    } finally {
      clearInterval(progressInterval);
      setLoadingState(false);
    }
  }, [input, isLoading, addMessage, clearInput, setLoadingState, setProcessingProgress, processMessage]);

  return {
    messages,
    input,
    isLoading,
    processingProgress,
    setInput,
    handleSend,
    addMessage,
    updateMessage,
    recordFeedback
  };
};
