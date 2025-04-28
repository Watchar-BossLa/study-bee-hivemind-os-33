
import { BaseAgent, SpecializedAgent, UserInteraction } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { LLMRouter } from './LLMRouter';
import { CouncilService } from './CouncilService';
import { DeliberationService } from './DeliberationService';
import { InteractionService } from './InteractionService';
import { AgentService } from './AgentService';
import { allSpecializedAgents } from './SpecializedAgents';

export class QuorumForge {
  private agentService: AgentService;
  private councilService: CouncilService;
  private deliberationService: DeliberationService;
  private interactionService: InteractionService;
  
  constructor(
    agents: SpecializedAgent[] = allSpecializedAgents, 
    router: LLMRouter = new LLMRouter()
  ) {
    this.agentService = new AgentService(agents);
    this.councilService = new CouncilService(agents);
    this.deliberationService = new DeliberationService();
    this.interactionService = new InteractionService(router);
  }

  public async deliberate(
    councilId: string, 
    topic: string, 
    context: Record<string, any>,
    maxTurns: number = 3, 
    consensusThreshold: number = 0.8
  ): Promise<CouncilDecision> {
    const council = this.councilService.getCouncil(councilId);
    if (!council) {
      throw new Error(`Council "${councilId}" does not exist`);
    }
    
    return this.deliberationService.deliberate(
      council,
      topic,
      context,
      maxTurns,
      consensusThreshold
    );
  }

  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any>
  ): Promise<UserInteraction> {
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
      context,
      agentResponses: []
    };

    for (const agent of council) {
      const response = await this.interactionService.processAgentResponse(
        agent,
        message,
        context
      );
      interaction.agentResponses.push(response);
    }

    this.interactionService.addInteraction(interaction);
    return interaction;
  }

  public getAgents(): SpecializedAgent[] {
    return this.agentService.getAgents();
  }

  public getCouncils(): Map<string, SpecializedAgent[]> {
    return this.councilService.getAllCouncils();
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.deliberationService.getRecentDecisions(limit);
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

export const quorumForge = new QuorumForge();
