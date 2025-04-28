
import { LLMModel } from '../types/agents';
import { ModelSelectionResult, RouterRequest } from '../types/router';

// Sample LLM models based on the Study Bee spec
export const availableLLMs: LLMModel[] = [
  {
    id: 'llama-3-8b',
    name: 'Llama-3 (8B)',
    provider: 'llama',
    capabilities: ['tutor', 'qa', 'summarization'],
    costPerToken: 0.0001,
    latency: 'low',
    maxTokens: 4096,
    isAvailable: true
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    capabilities: ['tutor', 'qa', 'summarization', 'code', 'reasoning'],
    costPerToken: 0.001,
    latency: 'medium',
    maxTokens: 8192,
    isAvailable: true
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    provider: 'anthropic',
    capabilities: ['tutor', 'qa', 'summarization', 'reasoning'],
    costPerToken: 0.0008,
    latency: 'medium',
    maxTokens: 100000,
    isAvailable: true
  },
  {
    id: 'mixtral',
    name: 'Mixtral',
    provider: 'mistral',
    capabilities: ['tutor', 'qa', 'summarization'],
    costPerToken: 0.0003,
    latency: 'medium',
    maxTokens: 32768,
    isAvailable: true
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'mistral',
    capabilities: ['tutor', 'qa', 'summarization', 'code', 'reasoning'],
    costPerToken: 0.0006,
    latency: 'medium',
    maxTokens: 32000,
    isAvailable: true
  }
];

// Performance tracking for model selection improvement
interface ModelPerformanceMetrics {
  selectionCount: number;
  successRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
}

export class LLMRouter {
  private models: LLMModel[];
  private performanceMetrics: Map<string, ModelPerformanceMetrics>;
  private lastSelections: {modelId: string, requestHash: string, timestamp: number}[] = [];

  constructor(models: LLMModel[] = availableLLMs) {
    this.models = models;
    this.performanceMetrics = new Map();
    
    // Initialize performance metrics for each model
    this.models.forEach(model => {
      this.performanceMetrics.set(model.id, {
        selectionCount: 0,
        successRate: 0.95, // Initial assumption
        averageResponseTime: model.latency === 'low' ? 500 : model.latency === 'medium' ? 1000 : 2000,
        userSatisfaction: 4.5 // Initial assumption on a 5-point scale
      });
    });
  }

  // Create a hash for a request to track unique requests
  private hashRequest(request: RouterRequest): string {
    return `${request.task}-${request.complexity}-${request.urgency}-${request.costSensitivity}`;
  }

  // Compute score for each model based on request parameters with enhanced logic
  public selectModel(request: RouterRequest): LLMModel {
    const requestHash = this.hashRequest(request);
    
    // Check if we've seen this exact request type recently
    const recentSimilarSelection = this.lastSelections
      .find(s => s.requestHash === requestHash && (Date.now() - s.timestamp) < 300000); // Within 5 minutes
    
    if (recentSimilarSelection && Math.random() > 0.2) { // 80% of the time reuse the same model for similar requests
      const recentModel = this.models.find(m => m.id === recentSimilarSelection.modelId);
      if (recentModel && recentModel.isAvailable) {
        // Track this selection
        this.lastSelections.push({
          modelId: recentModel.id,
          requestHash,
          timestamp: Date.now()
        });
        
        // Update metrics
        const metrics = this.performanceMetrics.get(recentModel.id);
        if (metrics) {
          this.performanceMetrics.set(recentModel.id, {
            ...metrics,
            selectionCount: metrics.selectionCount + 1
          });
        }
        
        return recentModel;
      }
    }
    
    // Filter models that have the required capability
    let eligibleModels = this.models.filter(model => 
      model.isAvailable && model.capabilities.includes(request.task)
    );

    if (eligibleModels.length === 0) {
      throw new Error(`No available model supports task: ${request.task}`);
    }

    // Enhanced scoring algorithm with more detailed decision factors
    const scoredModels = eligibleModels.map(model => {
      let score = 0;
      const reasoningTrace: string[] = [];
      
      // Base capability score
      score += 10;
      reasoningTrace.push(`Base capability score: +10`);
      
      // Context length requirements
      if (request.contextLength) {
        const contextScore = request.contextLength < model.maxTokens ? 5 : 
                            request.contextLength < model.maxTokens * 0.8 ? 3 : 0;
        score += contextScore;
        reasoningTrace.push(`Context length score: +${contextScore}`);
      }
      
      // Complexity score - higher complexity needs more powerful models
      let complexityScore = 0;
      if (request.complexity === 'high') {
        complexityScore = model.maxTokens > 30000 ? 5 : model.maxTokens > 8000 ? 3 : 1;
      } else if (request.complexity === 'medium') {
        complexityScore = model.maxTokens > 8000 ? 3 : 5; // Mid-tier models are best for medium complexity
      } else {
        complexityScore = model.maxTokens < 8000 ? 5 : 3; // Smaller models are fine for low complexity
      }
      score += complexityScore;
      reasoningTrace.push(`Complexity score: +${complexityScore}`);
      
      // Urgency score - higher urgency prefers lower latency
      let urgencyScore = 0;
      if (request.urgency === 'high') {
        urgencyScore = model.latency === 'low' ? 5 : model.latency === 'medium' ? 2 : 0;
      } else if (request.urgency === 'medium') {
        urgencyScore = model.latency === 'medium' ? 5 : 3;
      } else {
        urgencyScore = 3; // For low urgency, latency matters less
      }
      score += urgencyScore;
      reasoningTrace.push(`Urgency score: +${urgencyScore}`);
      
      // Cost sensitivity score
      let costScore = 0;
      if (request.costSensitivity === 'high') {
        costScore = model.costPerToken < 0.0003 ? 5 : model.costPerToken < 0.0008 ? 3 : 1;
      } else if (request.costSensitivity === 'medium') {
        costScore = model.costPerToken < 0.0008 ? 3 : 2;
      } else {
        costScore = 3; // For low cost sensitivity, cost matters less
      }
      score += costScore;
      reasoningTrace.push(`Cost sensitivity score: +${costScore}`);
      
      // User skill level adjustment
      if (request.userSkillLevel) {
        const skillScore = request.userSkillLevel === 'advanced' && model.maxTokens > 20000 ? 3 : 
                          request.userSkillLevel === 'beginner' && model.latency === 'low' ? 2 : 1;
        score += skillScore;
        reasoningTrace.push(`User skill level score: +${skillScore}`);
      }
      
      // Previous model success rate
      if (request.previousSuccess && request.previousSuccess[model.id]) {
        const successRateScore = Math.min(5, request.previousSuccess[model.id] * 5);
        score += successRateScore;
        reasoningTrace.push(`Previous success score: +${successRateScore}`);
      }
      
      // Performance metrics
      const metrics = this.performanceMetrics.get(model.id);
      if (metrics) {
        // Success rate component
        const successScore = metrics.successRate * 3;
        score += successScore;
        reasoningTrace.push(`Historical success rate score: +${successScore.toFixed(1)}`);
        
        // User satisfaction component
        const satisfactionScore = metrics.userSatisfaction;
        score += satisfactionScore;
        reasoningTrace.push(`User satisfaction score: +${satisfactionScore.toFixed(1)}`);
      }
      
      return { model, score, reasoningTrace };
    });

    // Sort by score descending
    scoredModels.sort((a, b) => b.score - a.score);
    
    // Update the last selections list
    if (this.lastSelections.length >= 20) {
      this.lastSelections.shift(); // Remove oldest if we have too many
    }
    
    this.lastSelections.push({
      modelId: scoredModels[0].model.id,
      requestHash,
      timestamp: Date.now()
    });
    
    // Update metrics for the selected model
    const selectedId = scoredModels[0].model.id;
    const currentMetrics = this.performanceMetrics.get(selectedId);
    if (currentMetrics) {
      this.performanceMetrics.set(selectedId, {
        ...currentMetrics,
        selectionCount: currentMetrics.selectionCount + 1
      });
    }
    
    // Return the highest-scoring model
    return scoredModels[0].model;
  }
  
  // Get detailed selection result with fallbacks
  public getDetailedSelection(request: RouterRequest): ModelSelectionResult {
    // Get top model
    const scoredModels = this.models
      .filter(model => model.isAvailable && model.capabilities.includes(request.task))
      .map(model => {
        // Use simplified scoring for brevity
        let score = 0;
        const reasoningTrace: string[] = [];
        
        // Task capability (required)
        score += 10;
        reasoningTrace.push(`Has required capability: ${request.task}`);
        
        // Complexity match
        if (request.complexity === 'high' && model.maxTokens > 20000) {
          score += 5;
          reasoningTrace.push("Good match for high complexity task");
        } else if (request.complexity === 'medium' && model.maxTokens > 8000) {
          score += 3;
          reasoningTrace.push("Good match for medium complexity task");
        }
        
        // Cost sensitivity
        if (request.costSensitivity === 'high' && model.costPerToken < 0.0003) {
          score += 4;
          reasoningTrace.push("Meets high cost sensitivity requirements");
        }
        
        // Urgency requirements
        if (request.urgency === 'high' && model.latency === 'low') {
          score += 5;
          reasoningTrace.push("Fast response time for high urgency");
        }
        
        return { model, score, reasoningTrace };
      })
      .sort((a, b) => b.score - a.score);
    
    if (scoredModels.length === 0) {
      throw new Error(`No available model supports task: ${request.task}`);
    }
    
    const topModel = scoredModels[0].model;
    const fallbackOptions = scoredModels
      .slice(1, 3)
      .map(item => item.model.id);
    
    return {
      modelId: topModel.id,
      confidence: Math.min(0.99, scoredModels[0].score / (scoredModels[0].score + (scoredModels[1]?.score || 1))),
      fallbackOptions,
      reasoningTrace: scoredModels[0].reasoningTrace
    };
  }
  
  // Log model selection for analytics with enhanced data
  public logSelection(modelId: string, request: RouterRequest, successful: boolean, responseTimeMs?: number, userRating?: number): void {
    console.log(`LLM Router selected ${modelId} for task ${request.task} (success: ${successful})`);
    
    // Update performance metrics
    const metrics = this.performanceMetrics.get(modelId);
    if (metrics) {
      const newSuccessRate = (metrics.successRate * metrics.selectionCount + (successful ? 1 : 0)) / 
                            (metrics.selectionCount + 1);
      
      const newAvgResponseTime = responseTimeMs ? 
        (metrics.averageResponseTime * metrics.selectionCount + responseTimeMs) / (metrics.selectionCount + 1) : 
        metrics.averageResponseTime;
        
      const newSatisfaction = userRating ? 
        (metrics.userSatisfaction * metrics.selectionCount + userRating) / (metrics.selectionCount + 1) :
        metrics.userSatisfaction;
      
      this.performanceMetrics.set(modelId, {
        selectionCount: metrics.selectionCount + 1,
        successRate: newSuccessRate,
        averageResponseTime: newAvgResponseTime,
        userSatisfaction: newSatisfaction
      });
    }
    
    // In a real implementation, this would send telemetry to a backend service
  }
  
  // Get performance metrics for all models
  public getPerformanceMetrics(): Map<string, ModelPerformanceMetrics> {
    return new Map(this.performanceMetrics);
  }
  
  // Reset performance metrics for testing or calibration
  public resetMetrics(): void {
    this.models.forEach(model => {
      this.performanceMetrics.set(model.id, {
        selectionCount: 0,
        successRate: 0.95,
        averageResponseTime: model.latency === 'low' ? 500 : model.latency === 'medium' ? 1000 : 2000,
        userSatisfaction: 4.5
      });
    });
    this.lastSelections = [];
  }
}

// Singleton instance for global use
export const llmRouter = new LLMRouter();
