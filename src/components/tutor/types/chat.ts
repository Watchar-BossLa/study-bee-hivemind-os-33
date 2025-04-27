
export interface MessageType {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  modelUsed?: string;
  relatedTopics?: string[];
  agentContributors?: string[];
  loading?: boolean;
}
