
import { LLMModel } from '../../types/agents';
import { RouterRequest, ModelSelectionResult } from '../../types/router';
import { modelPerformanceTracker } from './modelPerformanceTracker';
import { routerChain } from './RouterChain';

export class ModelSelector {
  private models: LLMModel[];

  constructor(models: LLMModel[]) {
    this.models = models;
    // Initialize performance metrics for each model
    models.forEach(model => {
      modelPerformanceTracker.initializeMetrics(model.id, model.latency);
    });
  }

  private hashRequest(request: RouterRequest): string {
    return `${request.task}-${request.complexity}-${request.urgency}-${request.costSensitivity}`;
  }

  public selectModel(request: RouterRequest): LLMModel {
    const requestHash = this.hashRequest(request);
    
    const recentModelId = modelPerformanceTracker.getRecentSimilarSelection(requestHash);
    if (recentModelId && Math.random() > 0.2) {
      const recentModel = this.models.find(m => m.id === recentModelId);
      if (recentModel?.isAvailable) {
        modelPerformanceTracker.addSelection(recentModel.id, requestHash);
        return recentModel;
      }
    }
    
    // Use RouterChain for model selection
    try {
      const result = routerChain.selectModel(this.models, request);
      const selectedModel = this.models.find(m => m.id === result.modelId);
      
      if (selectedModel) {
        modelPerformanceTracker.addSelection(selectedModel.id, requestHash);
        return selectedModel;
      }
    } catch (error) {
      console.error('RouterChain error, falling back to basic selection:', error);
    }
    
    // Fallback to basic selection method
    let eligibleModels = this.models.filter(model => 
      model.isAvailable && model.capabilities.includes(request.task)
    );

    if (eligibleModels.length === 0) {
      throw new Error(`No available model supports task: ${request.task}`);
    }

    const scoredModels = this.scoreModels(eligibleModels, request);
    const selectedModel = scoredModels[0].model;
    
    modelPerformanceTracker.addSelection(selectedModel.id, requestHash);
    return selectedModel;
  }

  private scoreModels(models: LLMModel[], request: RouterRequest) {
    return models.map(model => {
      let score = 0;
      const reasoningTrace: string[] = [];
      
      // Base capability score
      score += 10;
      reasoningTrace.push(`Base capability score: +10`);
      
      // Context length score
      if (request.contextLength) {
        const contextScore = request.contextLength < model.maxTokens ? 5 : 
                           request.contextLength < model.maxTokens * 0.8 ? 3 : 0;
        score += contextScore;
        reasoningTrace.push(`Context length score: +${contextScore}`);
      }
      
      // Complexity and urgency scores
      const complexityScore = this.calculateComplexityScore(model, request.complexity);
      const urgencyScore = this.calculateUrgencyScore(model, request.urgency);
      score += complexityScore + urgencyScore;
      
      // Cost sensitivity score
      const costScore = this.calculateCostScore(model, request.costSensitivity);
      score += costScore;
      
      return { model, score, reasoningTrace };
    }).sort((a, b) => b.score - a.score);
  }

  private calculateComplexityScore(model: LLMModel, complexity: string): number {
    if (complexity === 'high') {
      return model.maxTokens > 30000 ? 5 : model.maxTokens > 8000 ? 3 : 1;
    } else if (complexity === 'medium') {
      return model.maxTokens > 8000 ? 3 : 5;
    }
    return model.maxTokens < 8000 ? 5 : 3;
  }

  private calculateUrgencyScore(model: LLMModel, urgency: string): number {
    if (urgency === 'high') {
      return model.latency === 'low' ? 5 : model.latency === 'medium' ? 2 : 0;
    } else if (urgency === 'medium') {
      return model.latency === 'medium' ? 5 : 3;
    }
    return 3;
  }

  private calculateCostScore(model: LLMModel, costSensitivity: string): number {
    if (costSensitivity === 'high') {
      return model.costPerToken < 0.0003 ? 5 : model.costPerToken < 0.0008 ? 3 : 1;
    } else if (costSensitivity === 'medium') {
      return model.costPerToken < 0.0008 ? 3 : 2;
    }
    return 3;
  }

  public getDetailedSelection(request: RouterRequest): ModelSelectionResult {
    try {
      // Use RouterChain for detailed selection
      const result = routerChain.selectModel(this.models, request);
      const selectedModel = this.models.find(m => m.id === result.modelId);
      
      if (selectedModel) {
        const scoredModels = this.scoreModels(
          this.models.filter(model => model.isAvailable && model.capabilities.includes(request.task)),
          request
        );
        
        const fallbackOptions = scoredModels
          .slice(1, 3)
          .map(item => item.model.id);
        
        return {
          modelId: selectedModel.id,
          confidence: result.confidence,
          fallbackOptions,
          reasoningTrace: result.reasoningTrace,
          estimatedCost: selectedModel.costPerToken * 1000,
          estimatedLatency: this.getEstimatedLatency(selectedModel.latency),
          specializedCapabilities: selectedModel.capabilities
        };
      }
    } catch (error) {
      console.error('RouterChain error in detailed selection, falling back:', error);
    }
    
    // Fall back to original implementation
    const scoredModels = this.scoreModels(
      this.models.filter(model => model.isAvailable && model.capabilities.includes(request.task)),
      request
    );
    
    if (scoredModels.length === 0) {
      throw new Error(`No available model supports task: ${request.task}`);
    }
    
    const topModel = scoredModels[0].model;
    return {
      modelId: topModel.id,
      confidence: Math.min(0.99, scoredModels[0].score / (scoredModels[0].score + (scoredModels[1]?.score || 1))),
      fallbackOptions: scoredModels.slice(1, 3).map(item => item.model.id),
      reasoningTrace: scoredModels[0].reasoningTrace,
      estimatedCost: topModel.costPerToken * 1000,
      estimatedLatency: this.getEstimatedLatency(topModel.latency),
      specializedCapabilities: topModel.capabilities
    };
  }

  private getEstimatedLatency(latency: 'low' | 'medium' | 'high'): number {
    switch (latency) {
      case 'low': return 500;
      case 'medium': return 1500;
      case 'high': return 3000;
      default: return 1500;
    }
  }
}
