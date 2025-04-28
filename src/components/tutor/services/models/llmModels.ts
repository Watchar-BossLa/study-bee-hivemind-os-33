
import { LLMModel } from '../../types/agents';

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
