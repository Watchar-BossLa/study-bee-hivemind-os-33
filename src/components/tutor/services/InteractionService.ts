
import { SpecializedAgent, UserInteraction } from '../types/agents';
import { Council } from '../types/agents';

export class InteractionService {
  private interactions: UserInteraction[] = [];

  public async processAgentResponses(
    council: Council,
    message: string,
    context: Record<string, any> = {}
  ): Promise<Array<{
    agentId: string;
    response: string;
    modelUsed: string;
    confidenceScore: number;
    processingTimeMs: number;
  }>> {
    const responses = await Promise.all(
      council.agents.map(async (agent) => {
        const startTime = Date.now();
        
        // Simulate agent processing
        const response = `${agent.name} response to: ${message}`;
        const processingTime = Date.now() - startTime + Math.random() * 500;
        
        return {
          agentId: agent.id,
          response,
          modelUsed: 'gpt-4',
          confidenceScore: agent.performance.accuracy,
          processingTimeMs: processingTime
        };
      })
    );

    return responses;
  }

  public async combineAgentResponses(
    responses: Array<{
      agentId: string;
      response: string;
      modelUsed: string;
      confidenceScore: number;
      processingTimeMs: number;
    }>,
    originalMessage: string,
    context: Record<string, any> = {}
  ): Promise<string> {
    if (responses.length === 0) {
      return "I don't have enough information to provide a comprehensive answer.";
    }

    // Find the response with highest confidence
    const bestResponse = responses.reduce((best, current) => 
      current.confidenceScore > best.confidenceScore ? current : best
    );

    return bestResponse.response;
  }

  public recordInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
  }

  public getInteractionHistory(userId: string, limit: number = 10): UserInteraction[] {
    return this.interactions
      .filter(interaction => interaction.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}
