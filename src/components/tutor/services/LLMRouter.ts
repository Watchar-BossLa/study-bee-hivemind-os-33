
import { RouterRequest, ModelSelectionResult } from '../types/router';
import { availableLLMs } from './models/llmModels';
import { ModelSelector } from './models/modelSelector';
import { modelPerformanceTracker } from './models/modelPerformanceTracker';

export class LLMRouter {
  private modelSelector: ModelSelector;

  constructor(models = availableLLMs) {
    this.modelSelector = new ModelSelector(models);
  }

  public selectModel(request: RouterRequest) {
    return this.modelSelector.selectModel(request);
  }
  
  public getDetailedSelection(request: RouterRequest): ModelSelectionResult {
    return this.modelSelector.getDetailedSelection(request);
  }
  
  public logSelection(modelId: string, request: RouterRequest, successful: boolean, responseTimeMs?: number, userRating?: number): void {
    console.log(`LLM Router selected ${modelId} for task ${request.task} (success: ${successful})`);
    modelPerformanceTracker.logModelUsage(modelId, request, successful, responseTimeMs, userRating);
  }
  
  public getPerformanceMetrics() {
    return modelPerformanceTracker.getMetrics();
  }
  
  public resetMetrics(): void {
    modelPerformanceTracker.resetMetrics();
  }
}

// Singleton instance for global use
export const llmRouter = new LLMRouter();
