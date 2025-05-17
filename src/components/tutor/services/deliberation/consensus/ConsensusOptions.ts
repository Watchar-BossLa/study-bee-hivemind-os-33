
export interface ConsensusOptions {
  baseThreshold?: number; // 0-1, default 0.7
  minRequiredVotes?: number;
  timeoutMs?: number;
  topicComplexity?: 'low' | 'medium' | 'high';
}
