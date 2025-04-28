
import { useCallback } from 'react';
import { MessageType } from '../types/chat';
import { useMessageAnalysis } from './useMessageAnalysis';
import { useAgentResponse } from './useAgentResponse';

export const useCompletion = (
  messages: MessageType[],
  updateMessage: (id: string, updates: Partial<MessageType>) => void,
  updateMetadata: (updates: any) => void,
  addTopic: (topic: string) => void,
  updateModelUse: (modelId: string) => void,
  setIsLoading: (loading: boolean) => void,
  setProcessingProgress: (progress: number) => void,
  activePath: string | null,
  metadata: any
) => {
  const { analyzeMessage } = useMessageAnalysis(updateMetadata, addTopic);
  const { handleAgentResponse } = useAgentResponse(updateMessage, updateMetadata, updateModelUse);

  const completeResponse = useCallback(async () => {
    try {
      const userMessage = messages.find(m => m.role === 'user' && m.loading === undefined);
      if (!userMessage) return;
      
      const analysis = analyzeMessage(userMessage.content);
      
      const {
        bestResponse,
        contributingAgents,
        followUpQuestions,
        promptForFeedback
      } = await handleAgentResponse(
        userMessage, 
        analysis.topics,
        analysis.complexity,
        'user-123',
        activePath,
        metadata
      );

      updateMessage(messages[messages.length - 1].id, {
        content: bestResponse.response + (promptForFeedback ? 
          "\n\nWas this response helpful? You can rate it to help improve future responses." : ""),
        role: 'assistant',
        timestamp: new Date(),
        modelUsed: bestResponse.modelUsed,
        relatedTopics: analysis.topics,
        agentContributors: contributingAgents,
        loading: false,
        complexity: analysis.complexity,
        processingTime: bestResponse.processingTimeMs,
        requestFeedback: promptForFeedback,
        agentAnalysis: {
          primaryDomain: analysis.topics[0] || undefined,
          confidenceScores: Object.fromEntries(
            contributingAgents.map((agentId, index) => [
              agentId,
              bestResponse.confidenceScore * (1 - index * 0.1)
            ])
          ),
          recommendedFollowup: followUpQuestions
        },
        knowledgeGraphNodes: analysis.relatedNodes
      });
    } catch (error) {
      console.error('Error processing with QuorumForge:', error);
      
      updateMessage(messages[messages.length - 1].id, {
        content: "I apologize, but I encountered an issue processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
        modelUsed: 'System',
        loading: false
      });
    } finally {
      setIsLoading(false);
      setProcessingProgress(100);
    }
  }, [messages, activePath, metadata, updateMessage, analyzeMessage, handleAgentResponse, setIsLoading, setProcessingProgress]);

  return { completeResponse };
};
