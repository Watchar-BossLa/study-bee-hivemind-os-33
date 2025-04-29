
import { RouterRequest, ModelSelectionResult } from '../types/router';
import { availableLLMs } from './models/llmModels';
import { ModelSelector } from './models/modelSelector';
import { modelPerformanceTracker } from './models/modelPerformanceTracker';

export class LLMRouter {
  private modelSelector: ModelSelector;
  private frameworkRoutes: Map<string, string> = new Map();

  constructor(models = availableLLMs) {
    this.modelSelector = new ModelSelector(models);
    this.initializeFrameworkRoutes();
  }
  
  private initializeFrameworkRoutes(): void {
    // Map certain task types to specific framework processing
    this.frameworkRoutes.set('security-analysis', 'autogen');
    this.frameworkRoutes.set('collaborative-planning', 'crewai');
    this.frameworkRoutes.set('interactive-tutoring', 'langchain');
    this.frameworkRoutes.set('parallel-processing', 'openai-swarm');
  }

  public selectModel(request: RouterRequest) {
    // Check if the request should be routed to a specific framework
    const framework = this.getFrameworkForRequest(request);
    if (framework) {
      console.log(`Routing request to ${framework} framework`);
      // In a real implementation, this would return a framework-specific model
    }
    
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
  
  private getFrameworkForRequest(request: RouterRequest): string | null {
    if (!request.task) return null;
    
    // Check direct framework routes
    const directFramework = this.frameworkRoutes.get(request.task);
    if (directFramework) return directFramework;
    
    // Heuristic-based routing
    const query = request.query?.toLowerCase() || '';
    
    if (query.includes('security') || query.includes('vulnerability')) {
      return 'autogen';
    }
    
    if (request.complexity === 'high' && request.contextLength && request.contextLength > 5000) {
      return 'openai-swarm';
    }
    
    if (query.includes('explain') || query.includes('teach') || query.includes('help me understand')) {
      return 'langchain';
    }
    
    if (query.includes('plan') || query.includes('coordinate') || query.includes('organize')) {
      return 'crewai';
    }
    
    return null;
  }
  
  public registerFrameworkRoute(task: string, framework: string): void {
    this.frameworkRoutes.set(task, framework);
    console.log(`Registered ${task} to be routed to ${framework} framework`);
  }
}

// Singleton instance for global use
export const llmRouter = new LLMRouter();
