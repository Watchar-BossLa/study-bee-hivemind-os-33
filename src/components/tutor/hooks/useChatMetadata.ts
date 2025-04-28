
import { useState } from 'react';
import { MessageType } from '../types/chat';

interface ChatMetadata {
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

export function useChatMetadata() {
  const [metadata, setMetadata] = useState<ChatMetadata>({
    id: `session-${Date.now()}`,
    startTime: new Date(),
    topics: [],
    modelUse: {},
    complexity: 'medium',
    userSkillLevel: 'intermediate',
    primaryAgents: ['content-expert', 'learning-strategist']
  });

  const updateMetadata = (updates: Partial<ChatMetadata>) => {
    setMetadata(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addTopic = (topic: string) => {
    setMetadata(prev => ({
      ...prev,
      topics: [...new Set([...prev.topics, topic])]
    }));
  };

  const updateModelUse = (modelId: string) => {
    setMetadata(prev => ({
      ...prev,
      modelUse: {
        ...prev.modelUse,
        [modelId]: (prev.modelUse[modelId] || 0) + 1
      }
    }));
  };

  return {
    metadata,
    updateMetadata,
    addTopic,
    updateModelUse
  };
}
