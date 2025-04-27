
import { useState, useEffect } from 'react';
import { MessageType } from '../types/chat';
import { quorumForge } from '../services/QuorumForge';
import { useToast } from '@/hooks/use-toast';
import { learningPathService } from '../services/LearningPathService';

const initialMessages: MessageType[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI tutor powered by QuorumForge. I can help you understand various subjects using a knowledge graph to provide context-rich explanations. What would you like to learn about today?',
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
  const { toast } = useToast();

  const simulateProcessing = () => {
    setProcessingProgress(0);
    const steps = [
      "Analyzing query",
      "Routing to optimal LLM",
      "Convening QuorumForge council",
      "Retrieving knowledge graph nodes",
      "Generating consensus response"
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

  const completeResponse = async () => {
    try {
      // Generate a unique user ID (would normally come from auth)
      const mockUserId = 'user-123';
      
      // Use our QuorumForge system to process the user's message
      const userMessage = messages.find(m => m.loading === undefined && m.role === 'user');
      if (!userMessage) return;
      
      const interaction = await quorumForge.processInteraction(
        userMessage.content,
        mockUserId,
        { activePath }
      );
      
      // Find the highest confidence response
      const bestResponse = interaction.agentResponses.reduce(
        (best, current) => current.confidenceScore > best.confidenceScore ? current : best,
        interaction.agentResponses[0]
      );
      
      // Create our final response
      const agentNames = interaction.agentResponses.map(
        resp => quorumForge.getAgents().find(a => a.id === resp.agentId)?.name
      );
      
      // Check if this query might benefit from a learning path recommendation
      const topics = extractTopicsFromMessage(userMessage.content);
      if (topics.length > 0) {
        const recommendedPaths = topics.flatMap(
          topic => learningPathService.getPathsByTopic(topic)
        );
        
        // If we found a relevant learning path, suggest it
        if (recommendedPaths.length > 0) {
          const path = recommendedPaths[0]; // Take the first matching path
          
          // Show a toast with the recommendation
          toast({
            title: "Learning Path Recommended",
            description: `The "${path.name}" learning path is recommended based on your question.`,
          });
          
          // Update active path
          setActivePath(path.id);
        }
      }
      
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const loadingMessageIndex = newMessages.findIndex(msg => msg.loading);
        
        if (loadingMessageIndex !== -1) {
          newMessages[loadingMessageIndex] = {
            id: newMessages[loadingMessageIndex].id,
            content: bestResponse.response,
            role: 'assistant',
            timestamp: new Date(),
            modelUsed: bestResponse.modelUsed,
            relatedTopics: topics,
            agentContributors: agentNames.filter(Boolean) as string[],
            loading: false,
          };
        }
        
        return newMessages;
      });
    } catch (error) {
      console.error('Error processing with QuorumForge:', error);
      
      // Handle the error by providing an error message
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
    setInput,
    handleSend,
    setActivePath,
  };
};

// Helper function to extract potential topics from a message
function extractTopicsFromMessage(message: string): string[] {
  // This is a simplified implementation - in a real system,
  // this would use NLP/entity extraction to identify topics
  const lowerMessage = message.toLowerCase();
  const potentialTopics = [
    'Mitochondria', 'ATP', 'Cellular Respiration', 'Krebs Cycle',
    'Electron Transport', 'Glycolysis', 'Cell Biology', 'DNA',
    'RNA', 'Protein Synthesis', 'Genetics', 'Evolution',
    'Natural Selection'
  ];
  
  return potentialTopics.filter(topic => 
    lowerMessage.includes(topic.toLowerCase())
  );
}
