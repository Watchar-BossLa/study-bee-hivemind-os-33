
import { RouterRequest, ModelSelectionResult } from '../../types/router';
import { LLMModel } from '../../types/agents';
import { RouterHeuristic, RouterSelection } from './types/RouterTypes';
import { RouterCache } from './cache/RouterCache';
import { ModelScorer } from './scoring/ModelScorer';
import { RouterHeuristics } from './heuristics/RouterHeuristics';

/**
 * RouterChain - Implements the cost-optimized multi-LLM routing system
 * Uses heuristics to select the most appropriate model for a request
 */
export class RouterChain {
  private cache: RouterCache;
  private scorer: ModelScorer;
  
  constructor(initialHeuristics?: RouterHeuristic[]) {
    this.cache = new RouterCache();
    const heuristics = initialHeuristics || RouterHeuristics.getDefaultHeuristics();
    this.scorer = new ModelScorer(heuristics);
  }
  
  /**
   * Select the best model for a request using the RouterChain heuristics
   */
  public selectModel(
    models: LLMModel[],
    request: RouterRequest
  ): RouterSelection {
    // Check cache first
    const cachedModelId = this.cache.getCachedResult(request);
    if (cachedModelId) {
      return {
        modelId: cachedModelId,
        confidence: 1.0,
        reasoningTrace: ['Cached result']
      };
    }
    
    // Filter eligible models
    const eligibleModels = models.filter(model => 
      model.isActive && model.capabilities.includes(request.task)
    );

    if (eligibleModels.length === 0) {
      throw new Error(`No available model supports task: ${request.task}`);
    }

    // Score and rank models
    const scoredModels = this.scorer.scoreModels(eligibleModels, request);
    const selectedModel = scoredModels[0].model;
    
    // Cache the result
    this.cache.cacheResult(request, selectedModel.id);
    
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
   * Score models using the internal scorer
   */
  public scoreModels(models: LLMModel[], request: RouterRequest) {
    return this.scorer.scoreModels(models, request);
  }
  
  /**
   * Add a custom heuristic
   */
  public addHeuristic(heuristic: RouterHeuristic): void {
    this.scorer.addHeuristic(heuristic);
  }
  
  /**
   * Get cache statistics
   */
  public getCacheStats() {
    return this.cache.getStats();
  }
  
  /**
   * Reset cache
   */
  public resetCache(): void {
    this.cache.reset();
  }
  
  /**
   * Enable or disable cache
   */
  public setCache(enabled: boolean): void {
    this.cache.setEnabled(enabled);
  }
  
  /**
   * Get all heuristics
   */
  public getHeuristics(): RouterHeuristic[] {
    return this.scorer.getHeuristics();
  }
}

// Export a singleton instance for global use
export const routerChain = new RouterChain();
