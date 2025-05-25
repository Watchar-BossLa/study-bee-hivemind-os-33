import { SpecializedAgent, Council } from '../../types/agents';
import { InteractionService } from '../InteractionService';
import { CouncilService } from '../CouncilService';

export class InteractionManager {
  private interactionService: InteractionService;
  private councilService: CouncilService;

  constructor(
    interactionService: InteractionService,
    councilService: CouncilService
  ) {
    this.interactionService = interactionService;
    this.councilService = councilService;
  }

  public async processUserInteraction(
    userId: string,
    message: string,
    context: Record<string, any> = {}
  ): Promise<{
    response: string;
    agentContributions: Array<{
      agentId: string;
      response: string;
      confidence: number;
    }>;
    metadata: Record<string, any>;
  }> {
    try {
      // Determine optimal council for this interaction
      const councilId = this.councilService.determineCouncilForMessage(message);
      const councilAgents = this.councilService.getCouncil(councilId);
      
      if (!councilAgents || councilAgents.length === 0) {
        throw new Error(`No suitable council found for message: ${message}`);
      }

      // Create a Council object from the agents array
      const council: Council = {
        id: councilId,
        name: `Council-${councilId}`,
        topic: message,
        agents: councilAgents,
        status: 'active',
        createdAt: new Date()
      };

      // Get agent responses
      const agentResponses = await this.interactionService.processAgentResponses(
        council,
        message,
        context
      );

      // Combine agent responses into a single response
      const combinedResponse = await this.interactionService.combineAgentResponses(
        agentResponses,
        message,
        context
      );

      // Record the interaction
      this.interactionService.recordInteraction({
        id: Math.random().toString(36).substring(7),
        userId,
        agentId: 'combined',
        message,
        response: combinedResponse,
        timestamp: new Date()
      });

      // Extract agent contributions
      const agentContributions = agentResponses.map(agentResponse => ({
        agentId: agentResponse.agentId,
        response: agentResponse.response,
        confidence: agentResponse.confidenceScore
      }));

      return {
        response: combinedResponse,
        agentContributions,
        metadata: { councilId }
      };
    } catch (error) {
      console.error('Error processing user interaction:', error);
      return {
        response: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        agentContributions: [],
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}
