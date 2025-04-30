
import { LLMRouter } from '../LLMRouter';
import { RouterRequest } from '../../types/router';

export interface PromptTemplate {
  template: string;
  inputVariables: string[];
}

export interface Chain {
  id: string;
  name: string;
  description: string;
  prompt: PromptTemplate;
  memory: any;
}

export class LangChainIntegration {
  private router: LLMRouter;
  private chains: Map<string, Chain> = new Map();
  private memory: Map<string, any[]> = new Map();
  
  constructor(router: LLMRouter) {
    this.router = router;
    this.initializeDefaultChains();
    console.log('LangChain integration initialized for prompt orchestration');
  }
  
  private initializeDefaultChains(): void {
    // Example chains with prompt templates
    this.chains.set('tutor-chain', {
      id: 'tutor-chain',
      name: 'Tutoring Chain',
      description: 'Chain for tutoring interactions with students',
      prompt: {
        template: 'You are a helpful tutor. The student asks: {question}. Based on their skill level {skillLevel}, provide an appropriate explanation.',
        inputVariables: ['question', 'skillLevel']
      },
      memory: []
    });
    
    this.chains.set('assessment-chain', {
      id: 'assessment-chain',
      name: 'Assessment Chain',
      description: 'Chain for generating and evaluating assessments',
      prompt: {
        template: 'Create an assessment question for topic: {topic} at difficulty level {difficulty}.',
        inputVariables: ['topic', 'difficulty']
      },
      memory: []
    });
    
    this.chains.set('cot-reasoning', {
      id: 'cot-reasoning',
      name: 'Chain of Thought Reasoning',
      description: 'Chain for step-by-step reasoning through complex problems',
      prompt: {
        template: 'Think step by step to solve this problem: {problem}',
        inputVariables: ['problem']
      },
      memory: []
    });
  }
  
  public async runChain(chainId: string, inputs: Record<string, any>): Promise<string> {
    const chain = this.chains.get(chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} not found`);
    }
    
    // Add to memory
    if (!this.memory.has(chainId)) {
      this.memory.set(chainId, []);
    }
    
    // Create filled prompt from template
    let filledPrompt = chain.prompt.template;
    for (const variable of chain.prompt.inputVariables) {
      const value = inputs[variable] || '[not provided]';
      filledPrompt = filledPrompt.replace(`{${variable}}`, value);
    }
    
    // Create a properly typed request for the router
    const request: RouterRequest = {
      query: filledPrompt,
      task: this.determineTaskType(chainId),
      complexity: inputs.complexity || 'medium',
      urgency: inputs.urgency || 'medium',
      costSensitivity: 'medium',
    };
    
    // Get model selection
    const modelSelection = this.router.selectModel(request);
    
    // Simulate LLM response
    console.log(`Running chain ${chainId} with model ${modelSelection.id}`);
    
    // Generate a simple response based on the chain and inputs
    const response = `Response from ${chainId} using ${modelSelection.id} model: Processed input for ${Object.keys(inputs).join(', ')}`;
    
    // Add to memory
    const memoryEntry = {
      timestamp: new Date(),
      inputs,
      response
    };
    this.memory.get(chainId)?.push(memoryEntry);
    
    return response;
  }
  
  // Helper method to map chain ID to appropriate task type
  private determineTaskType(chainId: string): RouterRequest['task'] {
    if (chainId.includes('tutor')) return 'tutor';
    if (chainId.includes('assessment')) return 'qa';
    if (chainId.includes('summary') || chainId.includes('extract')) return 'summarization';
    if (chainId.includes('code') || chainId.includes('programming')) return 'code';
    if (chainId.includes('reasoning') || chainId.includes('cot')) return 'reasoning';
    
    // Default to tutoring as fallback
    return 'tutor';
  }
  
  public getChain(chainId: string): Chain | undefined {
    return this.chains.get(chainId);
  }
  
  public getAllChains(): Chain[] {
    return Array.from(this.chains.values());
  }
  
  public getMemory(chainId: string): any[] {
    return this.memory.get(chainId) || [];
  }
  
  public createChain(chain: Omit<Chain, 'id'>): Chain {
    const id = `chain-${Date.now()}`;
    const newChain = { ...chain, id };
    this.chains.set(id, newChain);
    return newChain;
  }
}
