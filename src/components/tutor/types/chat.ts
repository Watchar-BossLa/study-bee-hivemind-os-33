
export type MessageRole = 'user' | 'assistant';

export type MessageType = {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
  modelUsed?: string;
  loading?: boolean;
  relatedTopics?: string[];
};
