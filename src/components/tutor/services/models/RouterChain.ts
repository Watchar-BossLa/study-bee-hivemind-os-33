
import { RouterRequest, ModelSelectionResult } from '../../types/router';
import { LLMModel } from '../../types/agents';
import { modelPerformanceTracker } from './modelPerformanceTracker';

export interface RouterHeuristic {
  name: string;
  weight: number;
  evaluate: (model: LLMModel, request: RouterRequest) => number;
  reason: (model: LLMModel, request: RouterRequest) => string;
}

/**
 * RouterChain - Implements the cost-optimized multi-LLM routing system
 * Uses heuristics to select the most appropriate model for a request
 */
export class RouterChain {
  private heuristics: RouterHeuristic[] = [];
  private cache: Map<string, string> = new Map();
  private cacheHits = 0;
  private cacheMisses = 0;
  private maxCacheSize = 1000;
  private cacheEnabled = true;
  
  constructor(initialHeuristics?: RouterHeuristic[]) {
    // Initialize with default heuristics
    this.heuristics = initialHeuristics || this.getDefaultHeuristics();
  }
  
  /**
   * Generate a cache key for a request
   */
  private generateCacheKey(request: RouterRequest): string {
    // Create a deterministic string representation of the request
    const { query, task, complexity, urgency, costSensitivity } = request;
    return `${task}-${complexity}-${urgency}-${costSensitivity}-${query?.substring(0, 50)}`;
  }
  
  /**
   * Check if a cached result exists for the request
   */
  private getCachedResult(request: RouterRequest): string | null {
    if (!this.cacheEnabled) return null;
    
    const key = this.generateCacheKey(request);
    const cachedModelId = this.cache.get(key);
    
    if (cachedModelId) {
      this.cacheHits++;
      return cachedModelId;
    }
    
    this.cacheMisses++;
    return null;
  }
  
  /**
   * Cache a model selection result
   */
  private cacheResult(request: RouterRequest, modelId: string): void {
    if (!this.cacheEnabled) return;
    
    const key = this.generateCacheKey(request);
    this.cache.set(key, modelId);
    
    // Implement LRU cache if size exceeds maximum
    if (this.cache.size > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
  
  /**
   * Score models based on heuristics
   */
  public scoreModels(models: LLMModel[], request: RouterRequest): Array<{
    model: LLMModel;
    score: number;
    reasoningTrace: string[];
  }> {
    return models.map(model => {
      let score = 0;
      const reasoningTrace: string[] = [];
      
      // Apply each heuristic
      for (const heuristic of this.heuristics) {
        const heuristicScore = heuristic.evaluate(model, request) * heuristic.weight;
        score += heuristicScore;
        reasoningTrace.push(`${heuristic.name}: ${heuristicScore.toFixed(2)} (${heuristic.reason(model, request)})`);
      }
      
      return { model, score, reasoningTrace };
    }).sort((a, b) => b.score - a.score);
  }
  
  /**
   * Select the best model for a request using the RouterChain heuristics
   */
  public selectModel(
    models: LLMModel[],
    request: RouterRequest
  ): { modelId: string; confidence: number; reasoningTrace: string[] } {
    // Check cache first
    const cachedModelId = this.getCachedResult(request);
    if (cachedModelId) {
      return {
        modelId: cachedModelId,
        confidence: 1.0,
        reasoningTrace: ['Cached result']
      };
    }
    
    // Filter eligible models
    const eligibleModels = models.filter(model => 
      model.isAvailable && model.capabilities.includes(request.task)
    );

    if (eligibleModels.length === 0) {
      throw new Error(`No available model supports task: ${request.task}`);
    }

    // Score and rank models
    const scoredModels = this.scoreModels(eligibleModels, request);
    const selectedModel = scoredModels[0].model;
    
    // Cache the result
    this.cacheResult(request, selectedModel.id);
    
    // Calculate confidence as the difference between top two scores
    const topScore = scoredModels[0].score;
    const runnerUpScore = scoredModels[1]?.score || topScore * 0.5;
    const confidence = Math.min(0.99, topScore / (topScore + runnerUpScore));
    
    return {
      modelId: selectedModel.id,
      confidence,
      reasoningTrace: scoredModels[0].reasoningTrace
    };
  }
  
  /**
   * Get default heuristics for model selection
   */
  private getDefaultHeuristics(): RouterHeuristic[] {
    return [
      {
        name: 'Cost Efficiency',
        weight: 1.5,
        evaluate: (model, request) => {
          if (request.costSensitivity === 'high') {
            return model.costPerToken < 0.0003 ? 5 : 
                model.costPerToken < 0.0008 ? 3 : 1;
          } else if (request.costSensitivity === 'medium') {
            return model.costPerToken < 0.0008 ? 3 : 2; 
          }
          return 2;
        },
        reason: (model, request) => {
          const costLevel = model.costPerToken < 0.0003 ? 'low' : 
                        model.costPerToken < 0.0008 ? 'medium' : 'high';
          return `Cost is ${costLevel} (${model.costPerToken}) with ${request.costSensitivity} sensitivity`;
        }
      },
      {
        name: 'Latency Optimization',
        weight: 1.2,
        evaluate: (model, request) => {
          if (request.urgency === 'high') {
            return model.latency === 'low' ? 5 : 
                model.latency === 'medium' ? 2 : 0;
          } else if (request.urgency === 'medium') {
            return model.latency === 'medium' ? 4 : 3;
          }
          return 3;
        },
        reason: (model, request) => {
          return `Latency is ${model.latency} with ${request.urgency} urgency`;
        }
      },
      {
        name: 'Context Capacity',
        weight: 1.0,
        evaluate: (model, request) => {
          if (!request.contextLength) return 3;
          
          const utilizationRatio = request.contextLength / model.maxTokens;
          if (utilizationRatio > 0.9) return 0;
          if (utilizationRatio > 0.7) return 2;
          if (utilizationRatio > 0.5) return 4;
          return 5;
        },
        reason: (model, request) => {
          if (!request.contextLength) return 'No context length specified';
          const utilizationRatio = request.contextLength / model.maxTokens;
          return `Context utilization: ${(utilizationRatio * 100).toFixed(1)}% of capacity`;
        }
      },
      {
        name: 'Task Specialization',
        weight: 2.0,
        evaluate: (model, request) => {
          // Check if the model provider is specialized for certain tasks
          if (request.task === 'code' && (model.provider === 'anthropic' || model.provider === 'openai')) {
            return 5;
          }
          
          if (request.task === 'reasoning' && model.provider === 'anthropic') {
            return 4.5;
          }
          
          if (request.task === 'tutor' && model.maxTokens > 16000) {
            return 4;
          }
          
          return 3;
        },
        reason: (model, request) => {
          if (request.task === 'code' && (model.provider === 'anthropic' || model.provider === 'openai')) {
            return `${model.provider} specializes in code generation`;
          }
          
          if (request.task === 'reasoning' && model.provider === 'anthropic') {
            return `${model.provider} specializes in reasoning tasks`;
          }
          
          if (request.task === 'tutor' && model.maxTokens > 16000) {
            return `Large context window beneficial for tutoring`;
          }
          
          return `Standard capability for ${request.task}`;
        }
      },
      {
        name: 'Historic Performance',
        weight: 1.8,
        evaluate: (model, request) => {
          const metrics = modelPerformanceTracker.getMetrics().get(model.id);
          if (!metrics || metrics.selectionCount < 5) return 3;
          
          const baseScore = metrics.successRate * 5; // 0-5 scale
          
          // Adjust score based on recent performance with similar requests
          if (request.previousSuccess && request.previousSuccess[model.id]) {
            const previousSuccessRate = request.previousSuccess[model.id];
            return baseScore * (0.7 + 0.3 * previousSuccessRate);
          }
          
          return baseScore;
        },
        reason: (model, request) => {
          const metrics = modelPerformanceTracker.getMetrics().get(model.id);
          if (!metrics || metrics.selectionCount < 5) {
            return `Insufficient historical data (${metrics?.selectionCount || 0} uses)`;
          }
          
          if (request.previousSuccess && request.previousSuccess[model.id]) {
            return `Historic success rate: ${(metrics.successRate * 100).toFixed(1)}%, previous success on similar tasks: ${(request.previousSuccess[model.id] * 100).toFixed(1)}%`;
          }
          
          return `Historic success rate: ${(metrics.successRate * 100).toFixed(1)}%`;
        }
      },
      {
        name: 'Complexity Match',
        weight: 1.3,
        evaluate: (model, request) => {
          if (request.complexity === 'high') {
            // For high complexity, prefer models with large context windows
            return model.maxTokens > 30000 ? 5 : 
                  model.maxTokens > 8000 ? 3 : 1;
          } else if (request.complexity === 'medium') {
            // For medium complexity, mid-sized models are optimal
            return model.maxTokens > 8000 && model.maxTokens <= 30000 ? 5 : 3;
          } else {
            // For low complexity, smaller and faster models are better
            return model.maxTokens < 8000 ? 5 : 3;
          }
        },
        reason: (model, request) => {
          return `Model context size (${model.maxTokens.toLocaleString()} tokens) for ${request.complexity} complexity task`;
        }
      }
    ];
  }
  
  /**
   * Add a custom heuristic
   */
  public addHeuristic(heuristic: RouterHeuristic): void {
    this.heuristics.push(heuristic);
  }
  
  /**
   * Get cache statistics
   */
  public getCacheStats(): { hits: number; misses: number; size: number; hitRate: number } {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? this.cacheHits / total : 0;
    
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      size: this.cache.size,
      hitRate
    };
  }
  
  /**
   * Reset cache
   */
  public resetCache(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
  
  /**
   * Enable or disable cache
   */
  public setCache(enabled: boolean): void {
    this.cacheEnabled = enabled;
    if (!enabled) {
      this.resetCache();
    }
  }
  
  /**
   * Get all heuristics
   */
  public getHeuristics(): RouterHeuristic[] {
    return [...this.heuristics];
  }
}

// Export a singleton instance for global use
export const routerChain = new RouterChain();
