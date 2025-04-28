
import { useState, useEffect } from 'react';
import { MessageType } from '../types/chat';
import { quorumForge } from '../services/QuorumForge';
import { useToast } from '@/hooks/use-toast';
import { learningPathService } from '../services/LearningPathService';
import { llmRouter } from '../services/LLMRouter';
import { RouterRequest } from '../types/router';
import { allSpecializedAgents } from '../services/SpecializedAgents';

const initialMessages: MessageType[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI tutor powered by QuorumForge. I can help you understand various subjects using specialized AI agents and a knowledge graph to provide context-rich explanations. What would you like to learn about today?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 60000),
    modelUsed: 'QuorumForge OS',
  },
];

interface ChatSession {
  id: string;
  startTime: Date;
  topics: string[];
  modelUse: Record<string, number>;
  activePathId?: string;
  complexity: 'low' | 'medium' | 'high';
  userSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryAgents: string[];
  preferredModality?: 'text' | 'visual' | 'interactive';
}

export const useTutorChat = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [chatMetadata, setChatMetadata] = useState<ChatSession>({
    id: `session-${Date.now()}`,
    startTime: new Date(),
    topics: [],
    modelUse: {},
    complexity: 'medium',
    userSkillLevel: 'intermediate',
    primaryAgents: ['content-expert', 'learning-strategist']
  });
  const [modelPerformance, setModelPerformance] = useState<Map<string, any>>(new Map());
  const [agentPerformance, setAgentPerformance] = useState<Map<string, any>>(new Map());
  const { toast } = useToast();

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

  const completeResponse = async () => {
    try {
      const mockUserId = 'user-123';
      
      const userMessage = messages.find(m => m.loading === undefined && m.role === 'user');
      if (!userMessage) return;
      
      const messageComplexity = assessComplexity(userMessage.content);
      
      setChatMetadata(prev => ({
        ...prev,
        complexity: messageComplexity
      }));
      
      const topics = extractTopicsFromMessage(userMessage.content);
      if (topics.length > 0) {
        setChatMetadata(prev => ({
          ...prev, 
          topics: [...new Set([...prev.topics, ...topics])]
        }));
      }
      
      // Determine if we should suggest a specialized learning modality
      let suggestedModality: 'text' | 'visual' | 'interactive' | undefined;
      
      if (userMessage.content.toLowerCase().includes('diagram') || 
          userMessage.content.toLowerCase().includes('visual') ||
          userMessage.content.toLowerCase().includes('picture') ||
          userMessage.content.toLowerCase().includes('graph')) {
        suggestedModality = 'visual';
      } else if (userMessage.content.toLowerCase().includes('practice') ||
                userMessage.content.toLowerCase().includes('exercise') ||
                userMessage.content.toLowerCase().includes('try') ||
                userMessage.content.toLowerCase().includes('interactive')) {
        suggestedModality = 'interactive';
      }
      
      if (suggestedModality && suggestedModality !== chatMetadata.preferredModality) {
        setChatMetadata(prev => ({
          ...prev,
          preferredModality: suggestedModality
        }));
      }
      
      const interaction = await quorumForge.processInteraction(
        userMessage.content,
        mockUserId,
        { 
          activePath,
          complexity: messageComplexity,
          userSkillLevel: chatMetadata.userSkillLevel,
          topicId: topics[0],
          additionalContext: messages.map(m => m.content).join(' '),
          userId: mockUserId,
          preferredModality: chatMetadata.preferredModality
        }
      );
      
      const bestResponse = interaction.agentResponses.reduce(
        (best, current) => current.confidenceScore > best.confidenceScore ? current : best,
        interaction.agentResponses[0]
      );
      
      // Track which agents contributed to the response
      const contributingAgents = interaction.agentResponses
        .sort((a, b) => b.confidenceScore - a.confidenceScore)
        .map(resp => {
          const agent = allSpecializedAgents.find(a => a.id === resp.agentId);
          return agent?.name || resp.agentId;
        });
      
      setChatMetadata(prev => {
        const updatedModelUse = {...prev.modelUse};
        const modelId = bestResponse.modelUsed;
        updatedModelUse[modelId] = (updatedModelUse[modelId] || 0) + 1;
        
        // Update primary agents based on who contributed most
        const primaryAgents = interaction.agentResponses
          .sort((a, b) => b.confidenceScore - a.confidenceScore)
          .slice(0, 2)
          .map(resp => resp.agentId);
        
        return {
          ...prev, 
          modelUse: updatedModelUse,
          primaryAgents: primaryAgents.length > 0 ? primaryAgents : prev.primaryAgents
        };
      });
      
      // Determine if we should recommend a learning path
      if (topics.length > 0) {
        const recommendedPaths = topics.flatMap(
          topic => learningPathService.getPathsByTopic(topic)
        );
        
        if (recommendedPaths.length > 0) {
          const path = recommendedPaths[0];
          
          toast({
            title: "Learning Path Recommended",
            description: `The "${path.name}" learning path is recommended based on your question.`,
          });
          
          setActivePath(path.id);
          setChatMetadata(prev => ({...prev, activePathId: path.id}));
        }
      }
      
      // Identify related knowledge graph nodes
      const relatedNodes = identifyKnowledgeGraphNodes(userMessage.content, topics);
      
      // Suggest follow-up questions based on the context
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
            agentContributors: contributingAgents.filter(Boolean) as string[],
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
        assessUserSkillLevel();
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

  const assessUserSkillLevel = () => {
    const userMessages = messages.filter(m => m.role === 'user');
    
    const avgWordLength = userMessages.reduce((sum, msg) => 
      sum + msg.content.split(/\s+/).reduce((wSum, w) => wSum + w.length, 0) / 
            msg.content.split(/\s+/).length, 0) / userMessages.length;
    
    const avgMessageLength = userMessages.reduce((sum, msg) => 
      sum + msg.content.length, 0) / userMessages.length;
    
    const technicalTerms = ['therefore', 'furthermore', 'however', 'specifically', 'consequently'];
    const technicalTermUse = userMessages.reduce((count, msg) => 
      count + technicalTerms.filter(term => msg.content.toLowerCase().includes(term)).length, 0);
    
    let newSkillLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
    
    if (avgWordLength > 6 && avgMessageLength > 100 && technicalTermUse > 2) {
      newSkillLevel = 'advanced';
    } else if (avgWordLength < 4.5 && avgMessageLength < 50 && technicalTermUse === 0) {
      newSkillLevel = 'beginner';
    }
    
    if (newSkillLevel !== chatMetadata.userSkillLevel) {
      setChatMetadata(prev => ({...prev, userSkillLevel: newSkillLevel}));
      console.log(`Updated user skill level to ${newSkillLevel}`);
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

  const handleResponseFeedback = (messageId: string, rating: number) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.modelUsed) return;
    
    console.log(`User rated response ${messageId} with model ${message.modelUsed} as ${rating}/5`);
    
    const routerRequest: RouterRequest = {
      query: message.content || '',
      task: 'tutor',
      complexity: (message.complexity as 'low' | 'medium' | 'high') || 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    llmRouter.logSelection(message.modelUsed, routerRequest, rating > 3, message.processingTime, rating);
    
    // Record feedback for contributing agents
    if (message.agentContributors?.length && message.agentAnalysis?.confidenceScores) {
      const agentFeedback: Record<string, number> = {};
      
      // Find agent IDs from contributor names
      message.agentContributors.forEach(agentName => {
        const agent = allSpecializedAgents.find(a => a.name === agentName);
        if (agent) {
          agentFeedback[agent.id] = rating;
        }
      });
      
      // Record the feedback with QuorumForge
      quorumForge.recordFeedback(
        message.id,
        'user-123', // mockUserId
        rating,
        agentFeedback
      );
    }
    
    setMessages(prevMessages => {
      return prevMessages.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            userRating: rating,
            requestFeedback: false
          };
        }
        return m;
      });
    });
    
    toast({
      title: "Feedback Recorded",
      description: "Thank you for your feedback! It helps improve our agents and responses.",
    });
  };

  return {
    messages,
    input,
    isLoading,
    processingProgress,
    activePath,
    chatMetadata,
    modelPerformance,
    agentPerformance,
    setInput,
    handleSend,
    setActivePath,
    handleResponseFeedback,
    assessUserSkillLevel
  };
};

function extractTopicsFromMessage(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const potentialTopics = [
    'Mitochondria', 'ATP', 'Cellular Respiration', 'Krebs Cycle',
    'Electron Transport', 'Glycolysis', 'Cell Biology', 'DNA',
    'RNA', 'Protein Synthesis', 'Genetics', 'Evolution',
    'Natural Selection', 'Algebra', 'Calculus', 'Statistics',
    'Geometry', 'Probability', 'Physics', 'Chemistry',
    'Literature', 'Grammar', 'History', 'Philosophy',
    'Programming', 'Computer Science'
  ];
  
  return potentialTopics.filter(topic => 
    lowerMessage.includes(topic.toLowerCase())
  );
}

function identifyKnowledgeGraphNodes(message: string, topics: string[]): string[] {
  // In a real implementation, this would query the knowledge graph
  // For now, we'll just return the topics as nodes
  return topics.map(t => `node-${t.toLowerCase().replace(/\s+/g, '-')}`);
}

function generateFollowUpQuestions(message: string, topics: string[]): string[] {
  // Generate follow-up questions based on the topics and message content
  const followUps: string[] = [];
  
  // Add topic-specific follow-ups
  topics.forEach(topic => {
    if (topic.toLowerCase() === 'mitochondria' || topic.toLowerCase() === 'atp') {
      followUps.push("How does the electron transport chain contribute to ATP production?");
    } else if (topic.toLowerCase() === 'dna' || topic.toLowerCase() === 'rna') {
      followUps.push("What are the key differences between DNA and RNA?");
    } else if (topic.toLowerCase() === 'evolution' || topic.toLowerCase() === 'natural selection') {
      followUps.push("What are some examples of natural selection in action?");
    }
  });
  
  // Add generic follow-ups if needed
  if (followUps.length === 0) {
    followUps.push("Would you like me to explain this topic in more detail?");
    followUps.push("Would you like to see a visual representation of this concept?");
  }
  
  // Limit to 3 follow-up questions
  return followUps.slice(0, 3);
}
