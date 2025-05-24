
import { DeliberationResult, SpecializedAgent } from '../types/agents';
import { Council, CouncilDecision } from '../types/councils';

export interface DeliberationOptions {
  consensusThreshold?: number;
  timeLimit?: number;
  maxIterations?: number;
}

export class DeliberationService {
  private recentDecisions: CouncilDecision[] = [];

  public async processDeliberation(
    query: string,
    agentResponses: Array<{
      agentId: string;
      response: string;
      confidence: number;
    }>,
    context: Record<string, any> = {}
  ): Promise<DeliberationResult> {
    const votes = agentResponses.map(response => ({
      agentId: response.agentId,
      vote: response.confidence > 0.8 ? 'approve' as const : 'abstain' as const,
      reasoning: `Agent ${response.agentId} provided response with ${response.confidence} confidence`
    }));

    const averageConfidence = agentResponses.reduce((sum, resp) => sum + resp.confidence, 0) / agentResponses.length;
    const consensusResponse = this.combineResponses(agentResponses);

    return {
      id: `deliberation_${Date.now()}`,
      topic: query,
      consensusResponse,
      confidence: averageConfidence,
      participatingAgents: agentResponses.map(resp => resp.agentId),
      votes,
      recommendations: [`Continue with confidence level: ${averageConfidence.toFixed(2)}`],
      timestamp: new Date()
    };
  }

  public async deliberate(
    council: Council,
    topic: string,
    context: Record<string, any>,
    options: DeliberationOptions = {}
  ): Promise<CouncilDecision> {
    const { consensusThreshold = 0.8 } = options;
    
    const votes = council.agents.map(agent => ({
      agentId: agent.id,
      vote: 'approve' as const,
      reasoning: `Agent ${agent.name} supports the decision`
    }));

    const decision: CouncilDecision = {
      topic,
      votes,
      consensus: `Council consensus reached on: ${topic}`,
      confidenceScore: consensusThreshold,
      timestamp: new Date()
    };

    this.recentDecisions.push(decision);
    return decision;
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.recentDecisions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private combineResponses(responses: Array<{ agentId: string; response: string; confidence: number }>): string {
    if (responses.length === 0) {
      return "I don't have enough information to provide a comprehensive answer.";
    }

    if (responses.length === 1) {
      return responses[0].response;
    }

    const highConfidenceResponses = responses.filter(r => r.confidence > 0.8);
    
    if (highConfidenceResponses.length > 0) {
      return highConfidenceResponses[0].response;
    }

    return responses[0].response;
  }
}
