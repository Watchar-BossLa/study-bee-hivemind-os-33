
export type RouterRequest = {
  query: string;
  task: 'tutor' | 'qa' | 'summarization' | 'code' | 'reasoning';
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  costSensitivity: 'low' | 'medium' | 'high';
};
