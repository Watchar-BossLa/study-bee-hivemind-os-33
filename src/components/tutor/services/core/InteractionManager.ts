
import { InteractionService } from '../InteractionService';
import { FrameworkManager } from './FrameworkManager';
import { CouncilService } from '../CouncilService';
import { UserInteraction } from '../../types/agents';

export class InteractionManager {
  private interactionService: InteractionService;
  private councilService: CouncilService;
  private frameworkManager: FrameworkManager;
  
  constructor(
    interactionService: InteractionService,
    councilService: CouncilService,
    frameworkManager: FrameworkManager
  ) {
    this.interactionService = interactionService;
    this.councilService = councilService;
    this.frameworkManager = frameworkManager;
  }
  
  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any>
  ): Promise<UserInteraction> {
    // Validate the context using PydanticValidator
    const validatedContext = this.frameworkManager.getPydanticValidator().validateContext(context);
    
    // Check if there's a best performing council for similar queries
    const bestCouncilId = this.councilService.getBestCouncilForSimilarQuery(message);
    
    // If a best council was found, use it; otherwise determine based on message
    const councilId = bestCouncilId || this.councilService.determineCouncilForMessage(message);
    const council = this.councilService.getCouncil(councilId);
    
    if (!council) {
      throw new Error('Could not find appropriate council for message');
    }

    const interaction: UserInteraction = {
      id: `int-${Date.now()}`,
      userId,
      timestamp: new Date(),
      message,
      context: validatedContext,
      agentResponses: []
    };

    // Check if we should use parallel processing with OpenAI Swarm
    if (council.length > 4 && !validatedContext.sequential) {
      const responses = await this.frameworkManager.getOpenAISwarm().processParallel(
        council,
        message,
        validatedContext
      );
      
      interaction.agentResponses = responses;
    } else {
      // Standard sequential processing
      for (const agent of council) {
        const response = await this.interactionService.processAgentResponse(
          agent,
          message,
          validatedContext
        );
        interaction.agentResponses.push(response);
      }
    }
    
    // For security-related topics, use Autogen for red-team analysis
    if (this.isSecurityRelated(message)) {
      const securityAnalysis = await this.frameworkManager.getAutogenIntegration().runRedTeamAnalysis(message, validatedContext);
      interaction.securityAnalysis = securityAnalysis;
    }

    this.interactionService.addInteraction(interaction);
    return interaction;
  }

  private isSecurityRelated(message: string): boolean {
    const securityKeywords = [
      'security', 'vulnerability', 'hack', 'breach', 'attack', 
      'exploit', 'password', 'authentication', 'authorization'
    ];
    
    return securityKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }
  
  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactionService.getRecentInteractions(limit);
  }
  
  public getAgentPerformanceMetrics(agentId: string) {
    return this.interactionService.getAgentPerformanceMetrics(agentId);
  }
  
  public getAllAgentPerformanceMetrics() {
    return this.interactionService.getAllAgentPerformanceMetrics();
  }
  
  public recordFeedback(
    interactionId: string, 
    userId: string, 
    rating: number, 
    agentFeedback?: Record<string, number>,
    comments?: string
  ) {
    this.interactionService.recordUserFeedback(
      interactionId,
      userId,
      rating,
      agentFeedback,
      comments
    );
  }
  
  public getUserTopInterests(userId: string, limit: number = 5) {
    return this.interactionService.getUserTopInterests(userId, limit);
  }
}
