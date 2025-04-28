
import { useCallback } from 'react';
import { MessageType } from '../types/chat';
import { quorumForge } from '../services/QuorumForge';
import { learningPathService } from '../services/LearningPathService';
import { useToast } from '@/hooks/use-toast';
import { 
  extractTopicsFromMessage, 
  generateFollowUpQuestions, 
  identifyKnowledgeGraphNodes 
} from '../utils/topicUtils';
import { assessComplexity } from '../utils/messageUtils';

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
  const { toast } = useToast();

  const completeResponse = useCallback(async () => {
    try {
      const userMessage = messages.find(m => m.loading === undefined && m.role === 'user');
      if (!userMessage) return;
      
      const messageComplexity = assessComplexity(userMessage.content);
      updateMetadata({ complexity: messageComplexity });
      
      const topics = extractTopicsFromMessage(userMessage.content);
      topics.forEach(addTopic);
      
      const mockUserId = 'user-123';
      const interaction = await quorumForge.processInteraction(
        userMessage.content,
        mockUserId,
        { 
          activePath,
          complexity: messageComplexity,
          userSkillLevel: metadata.userSkillLevel,
          topicId: topics[0],
          additionalContext: messages.map(m => m.content).join(' '),
          userId: mockUserId,
          preferredModality: metadata.preferredModality
        }
      );

      const bestResponse = interaction.agentResponses.reduce(
        (best, current) => current.confidenceScore > best.confidenceScore ? current : best,
        interaction.agentResponses[0]
      );

      const contributingAgents = interaction.agentResponses
        .sort((a, b) => b.confidenceScore - a.confidenceScore)
        .map(resp => resp.agentId);
      
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

      const relatedNodes = identifyKnowledgeGraphNodes(userMessage.content, topics);
      const followUpQuestions = generateFollowUpQuestions(userMessage.content, topics);
      const promptForFeedback = Math.random() > 0.7;

      updateMessage(messages[messages.length - 1].id, {
        content: bestResponse.response + (promptForFeedback ? 
          "\n\nWas this response helpful? You can rate it to help improve future responses." : ""),
        role: 'assistant',
        timestamp: new Date(),
        modelUsed: bestResponse.modelUsed,
        relatedTopics: topics,
        agentContributors: contributingAgents,
        loading: false,
        complexity: messageComplexity,
        processingTime: bestResponse.processingTimeMs,
        requestFeedback: promptForFeedback,
        agentAnalysis: {
          primaryDomain: topics[0] || undefined,
          confidenceScores: interaction.agentResponses.reduce((scores, resp) => {
            scores[resp.agentId] = resp.confidenceScore;
            return scores;
          }, {} as Record<string, number>),
          recommendedFollowup: followUpQuestions
        },
        knowledgeGraphNodes: relatedNodes
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
  }, [messages, activePath, metadata, updateMetadata, addTopic, updateModelUse, toast, setIsLoading, setProcessingProgress]);

  return { completeResponse };
};
