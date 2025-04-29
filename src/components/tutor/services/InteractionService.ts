
import { UserInteraction } from '../types/agents';
import { LLMRouter } from './LLMRouter';
import { AgentResponseProcessor } from './interactions/AgentResponseProcessor';
import { UserInteractionTracker } from './interactions/UserInteractionTracker';
import { LangChainIntegration } from './frameworks/LangChainIntegration';

export class InteractionService {
  private responseProcessor: AgentResponseProcessor;
  private interactionTracker: UserInteractionTracker;
  private langChainIntegration: LangChainIntegration;

  constructor(router: LLMRouter) {
    this.responseProcessor = new AgentResponseProcessor(router);
    this.interactionTracker = new UserInteractionTracker();
    this.langChainIntegration = new LangChainIntegration(router);
  }

  public async processAgentResponse(agent: any, message: string, context: Record<string, any>) {
    // For coordinator agents, use LangChain integration for more sophisticated response handling
    if (agent.role && agent.role.toLowerCase().includes('coordinator')) {
      return this.processCoordinatorResponse(agent, message, context);
    }
    
    return this.responseProcessor.processAgentResponse(agent, message, context);
  }
  
  private async processCoordinatorResponse(agent: any, message: string, context: Record<string, any>) {
    console.log(`Processing coordinator response with LangChain for agent ${agent.id}`);
    
    // Determine which chain to use based on agent expertise
    let chainId = 'tutor-chain'; // default
    
    if (agent.expertise.some((e: string) => e.includes('assessment'))) {
      chainId = 'assessment-chain';
    } else if (agent.name.includes('Meta') || agent.role.includes('Coach')) {
      chainId = 'cot-reasoning';
    }
    
    try {
      const chainResponse = await this.langChainIntegration.runChain(chainId, {
        question: message,
        skillLevel: context.userSkillLevel || 'intermediate',
        topic: context.topicId || 'general',
        difficulty: context.complexity || 'medium',
        problem: message
      });
      
      return {
        agentId: agent.id,
        response: chainResponse,
        modelUsed: 'langchain-orchestrated',
        confidenceScore: 0.85,
        processingTimeMs: 800,
        chainId
      };
    } catch (error) {
      console.error("Error in LangChain processing:", error);
      // Fallback to standard processing
      return this.responseProcessor.processAgentResponse(agent, message, context);
    }
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
  
  public getLangChainIntegration(): LangChainIntegration {
    return this.langChainIntegration;
  }
}
