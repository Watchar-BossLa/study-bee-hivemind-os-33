
import { RouterRequest, ModelSelectionResult } from '../types/router';
import { availableLLMs } from './models/llmModels';
import { RouterChain, routerChain } from './models/RouterChain';
import { modelPerformanceTracker } from './models/modelPerformanceTracker';
import { LLMModel } from '../types/agents';

export class LLMRouter {
  private models: LLMModel[];
  private routerChain: RouterChain;
  private frameworkRoutes: Map<string, string> = new Map();

  constructor(models = availableLLMs, chain = routerChain) {
    this.models = models;
    this.routerChain = chain;
    this.initializeFrameworkRoutes();
    
    // Initialize performance metrics for each model
    models.forEach(model => {
      modelPerformanceTracker.initializeMetrics(model.id, model.latency);
    });
  }
  
  private initializeFrameworkRoutes(): void {
    // Map certain task types to specific framework processing
    this.frameworkRoutes.set('security-analysis', 'autogen');
    this.frameworkRoutes.set('collaborative-planning', 'crewai');
    this.frameworkRoutes.set('interactive-tutoring', 'langchain');
    this.frameworkRoutes.set('parallel-processing', 'openai-swarm');
  }

  public selectModel(request: RouterRequest): LLMModel {
    // Check if the request should be routed to a specific framework
    const framework = this.getFrameworkForRequest(request);
    if (framework) {
      console.log(`Routing request to ${framework} framework`);
      // In a real implementation, this would return a framework-specific model
    }
    
    try {
      // Use RouterChain to select the best model
      const result = this.routerChain.selectModel(this.models, request);
      const selectedModel = this.models.find(m => m.id === result.modelId);
      
      if (!selectedModel) {
        throw new Error(`Selected model ${result.modelId} not found`);
      }
      
      return selectedModel;
    } catch (error) {
      console.error('Error in RouterChain model selection:', error);
      
      // Fallback to a simple selection strategy
      const eligibleModels = this.models.filter(model => 
        model.isAvailable && model.capabilities.includes(request.task)
      );
      
      if (eligibleModels.length === 0) {
        throw new Error(`No available model supports task: ${request.task}`);
      }
      
      return eligibleModels[0];
    }
  }
  
  public getDetailedSelection(request: RouterRequest): ModelSelectionResult {
    try {
      const result = this.routerChain.selectModel(this.models, request);
      const selectedModel = this.models.find(m => m.id === result.modelId);
      
      if (!selectedModel) {
        throw new Error(`Selected model ${result.modelId} not found`);
      }
      
      // Get fallback options (next best models)
      const scoredModels = this.routerChain.scoreModels(
        this.models.filter(model => model.isAvailable && model.capabilities.includes(request.task)),
        request
      );
      
      const fallbackOptions = scoredModels
        .slice(1, 3)
        .map(item => item.model.id);
      
      // Calculate estimated cost and latency
      const estimatedTokens = request.contextLength || 1000;
      const estimatedCost = selectedModel.costPerToken * estimatedTokens;
      
      let estimatedLatency = 500; // Base latency in ms
      if (selectedModel.latency === 'medium') estimatedLatency = 1000;
      if (selectedModel.latency === 'high') estimatedLatency = 2000;
      
      // Calculate specialized capabilities
      const specializedCapabilities = selectedModel.capabilities.filter(
        cap => cap !== request.task && cap !== 'qa' && cap !== 'summarization'
      );
      
      return {
        modelId: selectedModel.id,
        confidence: result.confidence,
        fallbackOptions,
        reasoningTrace: result.reasoningTrace,
        estimatedCost,
        estimatedLatency,
        specializedCapabilities
      };
    } catch (error) {
      console.error('Error in detailed model selection:', error);
      
      // Provide a basic fallback response
      const eligibleModel = this.models.find(model => 
        model.isAvailable && model.capabilities.includes(request.task)
      );
      
      if (!eligibleModel) {
        throw new Error(`No available model supports task: ${request.task}`);
      }
      
      return {
        modelId: eligibleModel.id,
        confidence: 0.5,
        fallbackOptions: [],
        reasoningTrace: ['Fallback selection due to error'],
        estimatedCost: eligibleModel.costPerToken * 1000,
        estimatedLatency: eligibleModel.latency === 'low' ? 500 : 1000
      };
    }
  }
  
  public logSelection(
    modelId: string, 
    request: RouterRequest, 
    successful: boolean, 
    responseTimeMs?: number, 
    userRating?: number
  ): void {
    console.log(`LLM Router selected ${modelId} for task ${request.task} (success: ${successful})`);
    modelPerformanceTracker.logModelUsage(modelId, request, successful, responseTimeMs, userRating);
  }
  
  public getPerformanceMetrics() {
    return modelPerformanceTracker.getMetrics();
  }
  
  public resetMetrics(): void {
    modelPerformanceTracker.resetMetrics();
    this.routerChain.resetCache();
  }
  
  public getCacheStats() {
    return this.routerChain.getCacheStats();
  }
  
  public getHeuristics() {
    return this.routerChain.getHeuristics();
  }
  
  public addCustomHeuristic(heuristic: any): void {
    this.routerChain.addHeuristic(heuristic);
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
