
import { UserInteraction } from '../types/agents';
import { LLMRouter } from './LLMRouter';
import { RouterRequest } from '../types/router';

export class InteractionService {
  private interactions: UserInteraction[] = [];
  private router: LLMRouter;

  constructor(router: LLMRouter) {
    this.router = router;
  }

  public async processAgentResponse(
    agent: any,
    message: string,
    context: Record<string, any>
  ) {
    agent.status = 'busy';
    
    try {
      const routerRequest: RouterRequest = {
        query: message,
        task: 'tutor' as const,
        complexity: 'medium',
        urgency: 'medium',
        costSensitivity: 'medium'
      };
      
      const selectedModel = this.router.selectModel(routerRequest);
      
      await new Promise(resolve => setTimeout(resolve, agent.performance.responseTime));
      
      const response = {
        agentId: agent.id,
        response: `${agent.name} response using ${selectedModel.name}`,
        modelUsed: selectedModel.id,
        confidenceScore: Math.random() * 0.3 + 0.7,
        processingTimeMs: agent.performance.responseTime
      };
      
      this.router.logSelection(selectedModel.id, routerRequest, true);
      
      return response;
    } finally {
      agent.status = 'idle';
    }
  }

  public addInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
  }

  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactions.slice(-limit);
  }
}
