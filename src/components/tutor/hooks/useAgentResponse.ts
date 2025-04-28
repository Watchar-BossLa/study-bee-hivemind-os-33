
import { useCallback } from 'react';
import { MessageType } from '../types/chat';
import { generateFollowUpQuestions } from '../utils/topicUtils';
import { quorumForge } from '../services/QuorumForge';
import { learningPathService } from '../services/LearningPathService';
import { useToast } from '@/hooks/use-toast';

export const useAgentResponse = (
  updateMessage: (id: string, updates: Partial<MessageType>) => void,
  updateMetadata: (updates: any) => void,
  updateModelUse: (modelId: string) => void,
) => {
  const { toast } = useToast();

  const handleAgentResponse = useCallback(async (
    userMessage: MessageType,
    topics: string[],
    messageComplexity: 'low' | 'medium' | 'high',
    mockUserId: string = 'user-123',
    activePath: string | null = null,
    metadata: any = {}
  ) => {
    const interaction = await quorumForge.processInteraction(
      userMessage.content,
      mockUserId,
      {
        activePath,
        complexity: messageComplexity,
        userSkillLevel: metadata.userSkillLevel,
        topicId: topics[0],
        additionalContext: userMessage.content,
        userId: mockUserId,
        preferredModality: metadata.preferredModality
      }
    );

    const bestResponse = interaction.agentResponses.reduce(
      (best, current) => current.confidenceScore > best.confidenceScore ? current : best,
      interaction.agentResponses[0]
    );

    updateModelUse(bestResponse.modelUsed);

    if (topics.length > 0) {
      const recommendedPaths = learningPathService.getPathsByTopic(topics[0]);
      if (recommendedPaths.length > 0) {
        const path = recommendedPaths[0];
        toast({
          title: "Learning Path Recommended",
          description: `The "${path.name}" learning path is recommended based on your question.`,
        });
        updateMetadata({ activePathId: path.id });
      }
    }

    const followUpQuestions = generateFollowUpQuestions(userMessage.content, topics);
    const promptForFeedback = Math.random() > 0.7;

    return {
      bestResponse,
      contributingAgents: interaction.agentResponses
        .sort((a, b) => b.confidenceScore - a.confidenceScore)
        .map(resp => resp.agentId),
      followUpQuestions,
      promptForFeedback
    };
  }, [updateModelUse, updateMetadata, toast]);

  return { handleAgentResponse };
};
