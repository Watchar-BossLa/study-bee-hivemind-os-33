
import { useCallback } from 'react';
import { tutorService } from '@/services/TutorService';
import { MessageType } from '@/components/tutor/types/chat';
import { ErrorHandler } from '@/utils/errorHandling';

export const useTutorOperations = () => {
  const processMessage = useCallback(async (
    message: string,
    userId: string = 'anonymous',
    context?: Record<string, any>
  ): Promise<MessageType | null> => {
    try {
      const result = await tutorService.processQuery({
        message,
        userId,
        context
      });

      if (!result.success || !result.data) {
        throw result.error || new Error('Failed to process message');
      }

      return {
        id: (Date.now() + 1).toString(),
        content: result.data.response,
        role: 'assistant' as const,
        timestamp: new Date(),
        modelUsed: 'QuorumForge OS',
        agentContributors: result.data.agentContributions.map(contrib => contrib.agentId),
      };
    } catch (error) {
      ErrorHandler.handle(error, 'tutor-message-processing');
      return {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        role: 'assistant' as const,
        timestamp: new Date(),
        modelUsed: 'Error Handler',
      };
    }
  }, []);

  const recordFeedback = useCallback(async (
    messageId: string,
    userId: string,
    rating: number,
    agentFeedback?: Record<string, number>
  ) => {
    try {
      const result = await tutorService.recordFeedback(messageId, userId, rating, agentFeedback);
      if (!result.success) {
        throw result.error || new Error('Failed to record feedback');
      }
    } catch (error) {
      ErrorHandler.handle(error, 'tutor-feedback-recording');
    }
  }, []);

  return {
    processMessage,
    recordFeedback
  };
};
