
import { describe, it, expect, beforeEach } from 'vitest';
import { RouterChain } from '../RouterChain';
import { LLMModel } from '../../../types/agents';
import { RouterRequest } from '../../../types/router';

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
        costPerToken: 0.0001,
        maxTokens: 4096,
        latency: 'low',
        capabilities: ['tutor'],
        isActive: true,
        isAvailable: true
      },
      {
        id: 'model-b',
        name: 'Model B',
        provider: 'openai',
        costPerToken: 0.002,
        maxTokens: 4096,
        latency: 'medium',
        capabilities: ['tutor'],
        isActive: true,
        isAvailable: true
      }
    ];

    const request: RouterRequest = {
      query: 'test query',
      task: 'tutor',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };

    const result = routerChain.selectModel(models, request);
    
    expect(result.modelId).toBe('model-a');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should prioritize quality for high complexity requests', () => {
    const models: LLMModel[] = [
      {
        id: 'model-a',
        name: 'Model A',
        provider: 'local',
        costPerToken: 0.0001,
        maxTokens: 4096,
        latency: 'low',
        capabilities: ['tutor'],
        isActive: true,
        isAvailable: true
      },
      {
        id: 'model-b',
        name: 'Model B',
        provider: 'openai',
        costPerToken: 0.002,
        maxTokens: 32000,
        latency: 'medium',
        capabilities: ['tutor'],
        isActive: true,
        isAvailable: true
      }
    ];

    const request: RouterRequest = {
      query: 'complex query',
      task: 'tutor',
      complexity: 'high',
      urgency: 'high',
      costSensitivity: 'low'
    };

    const result = routerChain.selectModel(models, request);
    
    expect(result.modelId).toBe('model-b');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should handle empty model list', () => {
    const models: LLMModel[] = [];
    const request: RouterRequest = {
      query: 'test query',
      task: 'tutor',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };

    expect(() => routerChain.selectModel(models, request)).toThrow();
  });
});
