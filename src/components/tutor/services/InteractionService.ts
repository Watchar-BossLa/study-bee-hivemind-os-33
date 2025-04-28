import { UserInteraction } from '../types/agents';
import { LLMRouter } from './LLMRouter';
import { AgentResponseProcessor } from './interactions/AgentResponseProcessor';
import { UserInteractionTracker } from './interactions/UserInteractionTracker';

export class InteractionService {
  private responseProcessor: AgentResponseProcessor;
  private interactionTracker: UserInteractionTracker;

  constructor(router: LLMRouter) {
    this.responseProcessor = new AgentResponseProcessor(router);
    this.interactionTracker = new UserInteractionTracker();
  }

  public async processAgentResponse(agent: any, message: string, context: Record<string, any>) {
    return this.responseProcessor.processAgentResponse(agent, message, context);
  }

  public addInteraction(interaction: UserInteraction): void {
    this.interactionTracker.addInteraction(interaction);
  }

  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactionTracker.getRecentInteractions(limit);
  }

  public recordUserFeedback(
    interactionId: string, 
    userId: string, 
    rating: number, 
    agentFeedback?: Record<string, number>,
    comments?: string
  ): void {
    this.interactionTracker.recordUserFeedback(
      interactionId,
      userId,
      rating,
      agentFeedback,
      comments
    );
  }

  public getUserTopInterests(userId: string, limit: number = 5): string[] {
    return this.interactionTracker.getUserTopInterests(userId, limit);
  }

  public getAgentPerformanceMetrics(agentId: string) {
    return this.interactionTracker.getAgentPerformanceMetrics(agentId);
  }

  public getAllAgentPerformanceMetrics() {
    return this.interactionTracker.getAllAgentPerformanceMetrics();
  }
}
