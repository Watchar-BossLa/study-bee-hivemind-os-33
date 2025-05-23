
import { describe, it, expect, beforeEach } from 'vitest';
import { RouterChain } from '../RouterChain';
import { LLMModel } from '../../../types/agents';
import { RouterRequest } from '../../../types/router';

describe('RouterChain', () => {
  let routerChain: RouterChain;
  let testModels: LLMModel[];
  
  beforeEach(() => {
    // Setup test models
    testModels = [
      {
        id: 'test-model-1',
        name: 'Test Model 1',
        provider: 'provider-a',
        capabilities: ['tutor', 'qa'],
        costPerToken: 0.0001,
        latency: 'low',
        maxTokens: 4000,
        isAvailable: true
      },
      {
        id: 'test-model-2',
        name: 'Test Model 2',
        provider: 'provider-b',
        capabilities: ['tutor', 'qa', 'code'],
        costPerToken: 0.0008,
        latency: 'medium',
        maxTokens: 16000,
        isAvailable: true
      },
      {
        id: 'test-model-3',
        name: 'Test Model 3',
        provider: 'provider-c',
        capabilities: ['tutor', 'qa', 'reasoning'],
        costPerToken: 0.0015,
        latency: 'high',
        maxTokens: 32000,
        isAvailable: true
      },
      {
        id: 'unavailable-model',
        name: 'Unavailable Model',
        provider: 'provider-d',
        capabilities: ['tutor', 'qa'],
        costPerToken: 0.0001,
        latency: 'low',
        maxTokens: 4000,
        isAvailable: false
      }
    ];
    
    // Create a fresh RouterChain instance for each test
    routerChain = new RouterChain();
  });
  
  it('should select a model based on capabilities', () => {
    const request: RouterRequest = {
      query: 'How do I solve this equation?',
      task: 'tutor',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    const result = routerChain.selectModel(testModels, request);
    expect(result.modelId).toBeDefined();
    expect(testModels.some(m => m.id === result.modelId)).toBe(true);
  });
  
  it('should not select unavailable models', () => {
    const request: RouterRequest = {
      query: 'How do I solve this equation?',
      task: 'tutor',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    const result = routerChain.selectModel(testModels, request);
    expect(result.modelId).not.toBe('unavailable-model');
  });
  
  it('should select cost-efficient models when cost sensitivity is high', () => {
    const request: RouterRequest = {
      query: 'How do I solve this equation?',
      task: 'tutor',
      complexity: 'low',
      urgency: 'low',
      costSensitivity: 'high'
    };
    
    const result = routerChain.selectModel(testModels, request);
    expect(result.modelId).toBe('test-model-1');
  });
  
  it('should select low-latency models when urgency is high', () => {
    const request: RouterRequest = {
      query: 'How do I solve this equation?',
      task: 'tutor',
      complexity: 'low',
      urgency: 'high',
      costSensitivity: 'low'
    };
    
    const result = routerChain.selectModel(testModels, request);
    expect(result.modelId).toBe('test-model-1');
  });
  
  it('should select large context models for high complexity tasks', () => {
    const request: RouterRequest = {
      query: 'Explain the theory of relativity in detail',
      task: 'tutor',
      complexity: 'high',
      urgency: 'low',
      costSensitivity: 'low'
    };
    
    const result = routerChain.selectModel(testModels, request);
    expect(result.modelId).toBe('test-model-3');
  });
  
  it('should select models with specialized capabilities for specific tasks', () => {
    const request: RouterRequest = {
      query: 'Write a function to calculate prime numbers',
      task: 'code',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    const result = routerChain.selectModel(testModels, request);
    expect(result.modelId).toBe('test-model-2');
  });
  
  it('should throw an error when no models support the requested task', () => {
    const request: RouterRequest = {
      query: 'Translate this text',
      task: 'translation', // No model supports this
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    } as any;
    
    expect(() => routerChain.selectModel(testModels, request)).toThrow();
  });
  
  it('should cache results and reuse them', () => {
    const request: RouterRequest = {
      query: 'How do I solve this equation?',
      task: 'tutor',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    // First call should miss cache
    const result1 = routerChain.selectModel(testModels, request);
    
    // Second call with same request should hit cache
    const result2 = routerChain.selectModel(testModels, request);
    
    expect(result1.modelId).toBe(result2.modelId);
    
    // Check cache stats
    const cacheStats = routerChain.getCacheStats();
    expect(cacheStats.hits).toBe(1);
    expect(cacheStats.misses).toBe(1);
  });
  
  it('should reset cache when requested', () => {
    const request: RouterRequest = {
      query: 'How do I solve this equation?',
      task: 'tutor',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    // First call should miss cache
    routerChain.selectModel(testModels, request);
    
    // Reset cache
    routerChain.resetCache();
    
    // This should miss cache again
    routerChain.selectModel(testModels, request);
    
    // Check cache stats
    const cacheStats = routerChain.getCacheStats();
    expect(cacheStats.hits).toBe(0);
    expect(cacheStats.misses).toBe(2);
  });
});
