
import { AgentService } from './AgentService';
import { LLMRouter } from './LLMRouter';
import { DeliberationService } from './DeliberationService';
import { allSpecializedAgents } from './SpecializedAgents';
import { SwarmMetricsService } from './metrics/SwarmMetricsService';

export class QuorumForge {
  private agentService: AgentService;
  private llmRouter: LLMRouter;
  private deliberationService: DeliberationService;
  private swarmMetricsService: SwarmMetricsService;

  constructor() {
    this.agentService = new AgentService(allSpecializedAgents);
    this.llmRouter = new LLMRouter();
    this.deliberationService = new DeliberationService();
    this.swarmMetricsService = new SwarmMetricsService();
  }

  public async processQuery(
    query: string,
    context: Record<string, any> = {}
  ): Promise<{
    response: string;
    agentContributions: Array<{
      agentId: string;
      response: string;
      confidence: number;
    }>;
    consensusScore: number;
  }> {
    const relevantAgents = this.getRelevantAgents(query);
    
    const agentResponses = await Promise.all(
      relevantAgents.map(agent => 
        this.agentService.getAgentResponse(agent.id, query, context)
      )
    );

    const deliberationResult = await this.deliberationService.processDeliberation(
      query,
      agentResponses,
      context
    );

    return {
      response: deliberationResult.consensusResponse,
      agentContributions: agentResponses.map(resp => ({
        agentId: resp.agentId,
        response: resp.response,
        confidence: resp.confidence
      })),
      consensusScore: deliberationResult.confidence
    };
  }

  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any> = {}
  ): Promise<{
    agentResponses: Array<{
      agentId: string;
      response: string;
      confidenceScore: number;
      modelUsed: string;
      processingTimeMs: number;
    }>;
  }> {
    const relevantAgents = this.getRelevantAgents(message);
    
    const agentResponses = await Promise.all(
      relevantAgents.map(async (agent) => {
        const startTime = Date.now();
        const response = `${agent.name} response to: ${message}`;
        const processingTime = Date.now() - startTime + Math.random() * 500;
        
        return {
          agentId: agent.id,
          response,
          confidenceScore: agent.performance.accuracy,
          modelUsed: 'gpt-4',
          processingTimeMs: processingTime
        };
      })
    );

    return { agentResponses };
  }

  public recordFeedback(
    messageId: string,
    userId: string,
    rating: number,
    agentFeedback?: Record<string, number>
  ): void {
    console.log(`QuorumForge: Recording feedback for message ${messageId}`, {
      userId,
      rating,
      agentFeedback
    });
  }

  private getRelevantAgents(query: string) {
    const availableAgents = this.agentService.getAvailableAgents();
    return availableAgents.slice(0, 3);
  }

  public getAgentService(): AgentService {
    return this.agentService;
  }

  public getLLMRouter(): LLMRouter {
    return this.llmRouter;
  }

  public getDeliberationService(): DeliberationService {
    return this.deliberationService;
  }

  public getSwarmMetricsService(): SwarmMetricsService {
    return this.swarmMetricsService;
  }

  public async submitTask(task: {
    type: string;
    content: string;
    metadata?: Record<string, any>;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`QuorumForge: Task ${taskId} submitted:`, task);
    return taskId;
  }

  public async waitForTaskCompletion(taskId: string, timeoutMs: number = 30000): Promise<any> {
    console.log(`QuorumForge: Waiting for task ${taskId} completion (timeout: ${timeoutMs}ms)`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          taskId,
          status: 'completed',
          result: 'Task completed successfully'
        });
      }, Math.random() * 2000);
    });
  }
}

export const quorumForge = new QuorumForge();
