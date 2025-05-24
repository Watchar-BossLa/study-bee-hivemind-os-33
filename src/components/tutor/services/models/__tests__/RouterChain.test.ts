
import { describe, it, expect } from 'vitest';
import { RouterChain } from '../RouterChain';
import type { LLMModel, RouterRequest } from '../RouterChain';

describe('RouterChain', () => {
  let routerChain: RouterChain;

  beforeEach(() => {
    routerChain = new RouterChain();
  });

  it('should select model based on cost optimization', () => {
    const models: LLMModel[] = [
      {
        id: 'model-a',
        name: 'Model A',
        provider: 'local',
        costPer1kTokens: 0.001,
        maxTokens: 4096,
        contextWindow: 8192,
        latencyMs: 100,
        capabilities: ['text'],
        qualityScore: 8.5
      },
      {
        id: 'model-b',
        name: 'Model B',
        provider: 'openai',
        costPer1kTokens: 0.002,
        maxTokens: 4096,
        contextWindow: 8192,
        latencyMs: 200,
        capabilities: ['text'],
        qualityScore: 9.0
      },
      {
        id: 'model-c',
        name: 'Model C',
        provider: 'anthropic',
        costPer1kTokens: 0.003,
        maxTokens: 4096,
        contextWindow: 8192,
        latencyMs: 150,
        capabilities: ['text'],
        qualityScore: 9.2
      }
    ];

    const request: RouterRequest = {
      promptTokens: 100,
      maxTokens: 500,
      priority: 'medium',
      useCase: 'general'
    };

    const selectedModel = routerChain.selectOptimalModel(models, request);
    
    // Should select the most cost-effective model for medium priority
    expect(selectedModel.id).toBe('model-a');
  });

  it('should prioritize quality for high priority requests', () => {
    const models: LLMModel[] = [
      {
        id: 'model-a',
        name: 'Model A',
        provider: 'local',
        costPer1kTokens: 0.001,
        maxTokens: 4096,
        contextWindow: 8192,
        latencyMs: 100,
        capabilities: ['text'],
        qualityScore: 7.0
      },
      {
        id: 'model-b',
        name: 'Model B',
        provider: 'openai',
        costPer1kTokens: 0.002,
        maxTokens: 4096,
        contextWindow: 8192,
        latencyMs: 200,
        capabilities: ['text'],
        qualityScore: 9.5
      }
    ];

    const request: RouterRequest = {
      promptTokens: 100,
      maxTokens: 500,
      priority: 'high',
      useCase: 'critical'
    };

    const selectedModel = routerChain.selectOptimalModel(models, request);
    
    // Should select higher quality model for high priority
    expect(selectedModel.id).toBe('model-b');
  });

  it('should calculate routing score correctly', () => {
    const model: LLMModel = {
      id: 'test-model',
      name: 'Test Model',
      provider: 'local',
      costPer1kTokens: 0.001,
      maxTokens: 4096,
      contextWindow: 8192,
      latencyMs: 100,
      capabilities: ['text'],
      qualityScore: 8.0
    };

    const request: RouterRequest = {
      promptTokens: 100,
      maxTokens: 500,
      priority: 'medium',
      useCase: 'general'
    };

    const score = routerChain.calculateRoutingScore(model, request);
    
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
