
import { LLMModel } from '../../../types/agents';
import { RouterRequest } from '../../../types/router';

export interface RouterHeuristic {
  name: string;
  weight: number;
  evaluate: (model: LLMModel, request: RouterRequest) => number;
  reason: (model: LLMModel, request: RouterRequest) => string;
}

export interface ModelScore {
  model: LLMModel;
  score: number;
  reasoningTrace: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

export interface RouterSelection {
  modelId: string;
  confidence: number;
  reasoningTrace: string[];
}
