
export type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  modelUsed?: string;
  loading?: boolean;
  relatedTopics?: string[];
};
