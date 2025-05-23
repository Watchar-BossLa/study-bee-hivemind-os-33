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

  /**
   * Process a response from an agent
   */
  public async processAgentResponse(agent: any, message: string, context: Record<string, any>) {
    // For coordinator agents, use LangChain integration for more sophisticated response handling
    if (agent.role && agent.role.toLowerCase().includes('coordinator')) {
      return this.processCoordinatorResponse(agent, message, context);
    }
    
    return this.responseProcessor.processAgentResponse(agent, message, context);
  }
  
  /**
   * Process responses from multiple agents in parallel
   */
  public async processAgentResponses(agents: any[], message: string, context: Record<string, any>) {
    console.log(`Processing responses from ${agents.length} agents in parallel`);
    
    // Process all agent responses in parallel
    const responsePromises = agents.map(agent => 
      this.processAgentResponse(agent, message, context)
        .catch(err => {
          console.error(`Error processing response from agent ${agent.id}:`, err);
          return {
            agentId: agent.id,
            response: `Error: ${err.message}`,
            modelUsed: 'error',
            confidenceScore: 0,
            processingTimeMs: 0
          };
        })
    );
    
    return Promise.all(responsePromises);
  }
  
  /**
   * Combine responses from multiple agents into a single response
   */
  public async combineAgentResponses(
    agentResponses: any[],
    originalMessage: string,
    context: Record<string, any>
  ): Promise<string> {
    console.log(`Combining ${agentResponses.length} agent responses`);
    
    // If only one response, return it directly
    if (agentResponses.length === 1) {
      return agentResponses[0].response;
    }
    
    // Sort by confidence score
    const sortedResponses = [...agentResponses].sort((a, b) => 
      (b.confidenceScore || 0) - (a.confidenceScore || 0)
    );
    
    // If there's a clear winner (over 0.8 confidence), return it
    if (sortedResponses[0].confidenceScore > 0.8) {
      return sortedResponses[0].response;
    }
    
    // Otherwise, combine the top responses
    const topResponses = sortedResponses.slice(0, 3);
    
    // Sample combination: Extract unique insights from each response
    let combinedResponse = `Based on analysis from ${topResponses.length} agents:\n\n`;
    
    topResponses.forEach((response, index) => {
      combinedResponse += `Agent ${index + 1} (${response.agentId || 'unknown'}):\n${response.response}\n\n`;
    });
    
    return combinedResponse;
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
