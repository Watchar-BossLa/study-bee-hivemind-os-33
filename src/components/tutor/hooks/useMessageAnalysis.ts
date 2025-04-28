
import { useCallback } from 'react';
import { assessComplexity } from '../utils/messageUtils';
import { extractTopicsFromMessage, identifyKnowledgeGraphNodes } from '../utils/topicUtils';

export const useMessageAnalysis = (
  updateMetadata: (updates: any) => void,
  addTopic: (topic: string) => void
) => {
  const analyzeMessage = useCallback((message: string) => {
    const messageComplexity = assessComplexity(message);
    updateMetadata({ complexity: messageComplexity });
    
    const topics = extractTopicsFromMessage(message);
    topics.forEach(addTopic);
    
    const relatedNodes = identifyKnowledgeGraphNodes(message, topics);
    
    return {
      complexity: messageComplexity,
      topics,
      relatedNodes
    };
  }, [updateMetadata, addTopic]);

  return { analyzeMessage };
};
