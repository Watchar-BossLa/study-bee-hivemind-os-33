
import { LLMModel } from '../types/agents';
import { RouterRequest, ModelSelectionResult } from '../types/router';
import { RouterHeuristic, CacheStats } from './models/types/RouterTypes';

export interface PerformanceMetrics {
  selectionCount: number;
  successRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
}

export class LLMRouter {
  private models: LLMModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      costPerToken: 0.00003,
      maxTokens: 8192,
      capabilities: ['reasoning', 'coding', 'analysis'],
      isActive: true,
      isAvailable: true,
      latency: 'medium'
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      provider: 'Anthropic',
      costPerToken: 0.000015,
      maxTokens: 100000,
      capabilities: ['reasoning', 'analysis', 'creative'],
      isActive: true,
      isAvailable: true,
      latency: 'low'
    },
    {
      id: 'llama-3',
      name: 'Llama 3',
      provider: 'Meta',
      costPerToken: 0.000005,
      maxTokens: 4096,
      capabilities: ['general', 'coding'],
      isActive: true,
      isAvailable: true,
      latency: 'high'
    }
  ];

  private performanceMetrics: Map<string, PerformanceMetrics> = new Map();
  private cacheStats: CacheStats = { hits: 0, misses: 0, size: 0, hitRate: 0 };
  private heuristics: RouterHeuristic[] = [
    {
      name: 'Cost Efficiency',
      weight: 0.3,
      evaluate: (model: LLMModel, request: RouterRequest) => {
        if (request.costSensitivity === 'high') {
          return 1 / (model.costPerToken * 1000);
        }
        return 0.5;
      },
      reason: (model: LLMModel, request: RouterRequest) => 
        `Cost per token: ${model.costPerToken}`
    },
    {
      name: 'Capability Match',
      weight: 0.4,
      evaluate: (model: LLMModel, request: RouterRequest) => {
        return model.capabilities.includes(request.task) ? 1 : 0;
      },
      reason: (model: LLMModel, request: RouterRequest) => 
        `Supports ${request.task}: ${model.capabilities.includes(request.task)}`
    },
    {
      name: 'Performance',
      weight: 0.3,
      evaluate: (model: LLMModel, request: RouterRequest) => {
        const metrics = this.performanceMetrics.get(model.id);
        return metrics?.successRate || 0.5;
      },
      reason: (model: LLMModel, request: RouterRequest) => 
        `Success rate: ${this.performanceMetrics.get(model.id)?.successRate || 0.5}`
    }
  ];

  public async selectModel(request: RouterRequest): Promise<ModelSelectionResult> {
    const availableModels = this.models.filter(model => model.isActive && model.isAvailable);
    
    let selectedModel = availableModels[0];
    let confidence = 0.7;
    const reasoningTrace: string[] = [];

    if (request.costSensitivity === 'high') {
      selectedModel = availableModels.reduce((cheapest, current) => 
        current.costPerToken < cheapest.costPerToken ? current : cheapest
      );
      confidence = 0.8;
      reasoningTrace.push('Selected cheapest model due to high cost sensitivity');
    }

    if (request.complexity === 'high') {
      const highCapabilityModels = availableModels.filter(m => 
        m.capabilities.includes('reasoning') || m.capabilities.includes('analysis')
      );
      if (highCapabilityModels.length > 0) {
        selectedModel = highCapabilityModels[0];
        confidence = 0.9;
        reasoningTrace.push('Selected high-capability model for complex task');
      }
    }

    const fallbackOptions = availableModels
      .filter(m => m.id !== selectedModel.id)
      .map(m => m.id)
      .slice(0, 2);

    return {
      modelId: selectedModel.id,
      confidence,
      fallbackOptions,
      reasoningTrace,
      estimatedCost: selectedModel.costPerToken * 1000,
      estimatedLatency: 2000,
      specializedCapabilities: selectedModel.capabilities
    };
  }

  public getDetailedSelection(request: RouterRequest): ModelSelectionResult {
    return {
      modelId: 'gpt-4',
      confidence: 0.8,
      fallbackOptions: ['claude-3'],
      reasoningTrace: ['Default selection'],
      estimatedCost: 0.03,
      estimatedLatency: 2000,
      specializedCapabilities: ['reasoning']
    };
  }

  public logSelection(
    modelId: string, 
    request: RouterRequest, 
    success: boolean, 
    processingTime?: number, 
    rating?: number
  ): void {
    console.log(`LLM Router: Model ${modelId} selection logged`, {
      success,
      processingTime,
      rating,
      request: request.query?.substring(0, 50)
    });

    // Update performance metrics
    const metrics = this.performanceMetrics.get(modelId) || {
      selectionCount: 0,
      successRate: 0,
      averageResponseTime: 0,
      userSatisfaction: 0
    };
    
    metrics.selectionCount++;
    if (success !== undefined) {
      metrics.successRate = (metrics.successRate * (metrics.selectionCount - 1) + (success ? 1 : 0)) / metrics.selectionCount;
    }
    if (processingTime !== undefined) {
      metrics.averageResponseTime = (metrics.averageResponseTime * (metrics.selectionCount - 1) + processingTime) / metrics.selectionCount;
    }
    if (rating !== undefined) {
      metrics.userSatisfaction = (metrics.userSatisfaction * (metrics.selectionCount - 1) + rating) / metrics.selectionCount;
    }
    
    this.performanceMetrics.set(modelId, metrics);
  }

  public getAvailableModels(): LLMModel[] {
    return this.models.filter(model => model.isActive);
  }

  public updateModelStatus(modelId: string, isActive: boolean): void {
    const model = this.models.find(m => m.id === modelId);
    if (model) {
      model.isActive = isActive;
    }
  }

  // New methods required by dashboard
  public getPerformanceMetrics(): Map<string, PerformanceMetrics> {
    return new Map(this.performanceMetrics);
  }

  public getCacheStats(): CacheStats {
    return { ...this.cacheStats };
  }

  public getHeuristics(): RouterHeuristic[] {
    return [...this.heuristics];
  }

  public resetMetrics(): void {
    this.performanceMetrics.clear();
    this.cacheStats = { hits: 0, misses: 0, size: 0, hitRate: 0 };
  }
}

// Export singleton instance
export const llmRouter = new LLMRouter();
