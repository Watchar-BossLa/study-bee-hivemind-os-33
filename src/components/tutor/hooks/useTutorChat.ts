
import { useEffect, useCallback } from 'react';
import { quorumForge } from '../services/QuorumForge';
import { learningPathService } from '../services/LearningPathService';
import { llmRouter } from '../services/LLMRouter';
import { useSkillLevelAssessment } from './useSkillLevelAssessment';
import { useChatMetadata } from './useChatMetadata';
import { useMessages } from './useMessages';
import { useProcessingSimulation } from './useProcessingSimulation';
import { useFeedbackHandler } from './useFeedbackHandler';
import { useToast } from '@/hooks/use-toast';
import { 
  extractTopicsFromMessage, 
  generateFollowUpQuestions, 
  identifyKnowledgeGraphNodes 
} from '../utils/topicUtils';

export const useTutorChat = () => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const [modelPerformance, setModelPerformance] = useState<Map<string, any>>(new Map());
  const [agentPerformance, setAgentPerformance] = useState<Map<string, any>>(new Map());
  
  const { toast } = useToast();
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
          setActivePath(path.id);
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

      if (messages.length > 6) {
        assessSkillLevel(messages);
      }
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
  }, [messages, activePath, metadata, updateMetadata, addTopic, updateModelUse, toast, assessSkillLevel, setIsLoading, setProcessingProgress]);

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

const assessComplexity = (message: string): 'low' | 'medium' | 'high' => {
  const wordCount = message.split(/\s+/).length;
  const complexTerms = ['explain', 'compare', 'analyze', 'evaluate', 'synthesize', 'why', 'how'];
  const hasComplexTerms = complexTerms.some(term => message.toLowerCase().includes(term));
  const complexSubjects = ['quantum', 'calculus', 'algorithm', 'theorem', 'philosophy', 'genetics'];
  const hasComplexSubject = complexSubjects.some(subject => message.toLowerCase().includes(subject));
  
  if (wordCount > 25 || hasComplexSubject) {
    return 'high';
  } else if (wordCount > 10 || hasComplexTerms) {
    return 'medium';
  } else {
    return 'low';
  }
};
