
import { useState, useEffect } from 'react';
import { MessageType } from '../types/chat';
import { quorumForge } from '../services/QuorumForge';
import { useToast } from '@/hooks/use-toast';
import { learningPathService } from '../services/LearningPathService';
import { llmRouter } from '../services/LLMRouter';
import { RouterRequest } from '../types/router';
import { useSkillLevelAssessment } from './useSkillLevelAssessment';
import { useChatMetadata } from './useChatMetadata';
import { 
  extractTopicsFromMessage, 
  generateFollowUpQuestions, 
  identifyKnowledgeGraphNodes 
} from '../utils/topicUtils';

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
  const [activePath, setActivePath] = useState<string | null>(null);
  const [modelPerformance, setModelPerformance] = useState<Map<string, any>>(new Map());
  const [agentPerformance, setAgentPerformance] = useState<Map<string, any>>(new Map());
  
  const { toast } = useToast();
  const { skillLevel, assessSkillLevel } = useSkillLevelAssessment();
  const { metadata, updateMetadata, addTopic, updateModelUse } = useChatMetadata();

  useEffect(() => {
    const updateModelPerformance = () => {
      setModelPerformance(llmRouter.getPerformanceMetrics());
      setAgentPerformance(quorumForge.getAllAgentPerformanceMetrics());
    };
    
    updateModelPerformance();
    const intervalId = setInterval(updateModelPerformance, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const simulateProcessing = () => {
    setProcessingProgress(0);
    const steps = [
      "Analyzing query complexity",
      "Selecting optimal agent council",
      "Routing to specialized AI experts",
      "Retrieving knowledge graph nodes",
      "Coordinating multi-agent response",
      "Generating personalized explanation"
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        const progress = Math.round(((step + 1) / steps.length) * 100);
        setProcessingProgress(progress);
        step++;
      } else {
        clearInterval(interval);
        completeResponse();
      }
    }, 800);
  };

  const handleResponseFeedback = (messageId: string, rating: number) => {
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
    
    setMessages(prevMessages => 
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
  };

  const completeResponse = async () => {
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

      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const loadingMessageIndex = newMessages.findIndex(msg => msg.loading);
        
        if (loadingMessageIndex !== -1) {
          newMessages[loadingMessageIndex] = {
            id: newMessages[loadingMessageIndex].id,
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
          };
        }
        return newMessages;
      });

      if (messages.length > 6) {
        assessSkillLevel(messages);
      }
    } catch (error) {
      console.error('Error processing with QuorumForge:', error);
      
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const loadingMessageIndex = newMessages.findIndex(msg => msg.loading);
        
        if (loadingMessageIndex !== -1) {
          newMessages[loadingMessageIndex] = {
            id: newMessages[loadingMessageIndex].id,
            content: "I apologize, but I encountered an issue processing your request. Please try again.",
            role: 'assistant',
            timestamp: new Date(),
            modelUsed: 'System',
            loading: false,
          };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      setProcessingProgress(100);
    }
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

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };
    
    const loadingMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      loading: true,
    };
    
    setMessages([...messages, userMessage, loadingMessage]);
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
