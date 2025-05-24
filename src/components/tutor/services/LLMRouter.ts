
import { LLMModel } from '../types/agents';
import { RouterRequest, ModelSelectionResult } from '../types/router';

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
}

// Export singleton instance
export const llmRouter = new LLMRouter();
