
import { LLMModel } from '../types/agents';

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
  }
];

// Interface for router request
export interface RouterRequest {
  query: string;
  task: 'tutor' | 'qa' | 'summarization' | 'code' | 'reasoning';
  complexity: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  costSensitivity: 'low' | 'medium' | 'high';
  previousModelId?: string;
}

export class LLMRouter {
  private models: LLMModel[];

  constructor(models: LLMModel[] = availableLLMs) {
    this.models = models;
  }

  // Compute score for each model based on request parameters
  public selectModel(request: RouterRequest): LLMModel {
    // Filter models that have the required capability
    let eligibleModels = this.models.filter(model => 
      model.isAvailable && model.capabilities.includes(request.task)
    );

    if (eligibleModels.length === 0) {
      throw new Error(`No available model supports task: ${request.task}`);
    }

    // Score each model based on request parameters
    const scoredModels = eligibleModels.map(model => {
      let score = 0;
      
      // Task capability score (binary - it must have the capability)
      score += 10;
      
      // Complexity score - higher complexity needs more powerful models
      if (request.complexity === 'high') {
        score += model.maxTokens > 30000 ? 5 : model.maxTokens > 8000 ? 3 : 1;
      } else if (request.complexity === 'medium') {
        score += model.maxTokens > 8000 ? 3 : 5; // Mid-tier models are best for medium complexity
      } else {
        score += model.maxTokens < 8000 ? 5 : 3; // Smaller models are fine for low complexity
      }
      
      // Urgency score - higher urgency prefers lower latency
      if (request.urgency === 'high') {
        score += model.latency === 'low' ? 5 : model.latency === 'medium' ? 2 : 0;
      } else if (request.urgency === 'medium') {
        score += model.latency === 'medium' ? 5 : 3;
      } else {
        score += 3; // For low urgency, latency matters less
      }
      
      // Cost sensitivity score
      if (request.costSensitivity === 'high') {
        score += model.costPerToken < 0.0003 ? 5 : model.costPerToken < 0.0008 ? 3 : 1;
      } else if (request.costSensitivity === 'medium') {
        score += model.costPerToken < 0.0008 ? 3 : 2;
      } else {
        score += 3; // For low cost sensitivity, cost matters less
      }
      
      // Continuity bonus - prefer the same model as before if possible
      if (request.previousModelId === model.id) {
        score += 2;
      }
      
      return { model, score };
    });

    // Sort by score descending
    scoredModels.sort((a, b) => b.score - a.score);
    
    // Return the highest-scoring model
    return scoredModels[0].model;
  }
  
  // Log model selection for analytics
  public logSelection(modelId: string, request: RouterRequest, successful: boolean): void {
    console.log(`LLM Router selected ${modelId} for task ${request.task} (success: ${successful})`);
    // In a real implementation, this would send telemetry to a backend service
  }
}

// Singleton instance for global use
export const llmRouter = new LLMRouter();
