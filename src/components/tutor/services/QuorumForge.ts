
import { AgentService } from './AgentService';
import { LLMRouter } from './LLMRouter';
import { DeliberationService } from './DeliberationService';
import { allSpecializedAgents } from './SpecializedAgents';

export class QuorumForge {
  private agentService: AgentService;
  private llmRouter: LLMRouter;
  private deliberationService: DeliberationService;

  constructor() {
    this.agentService = new AgentService(allSpecializedAgents);
    this.llmRouter = new LLMRouter();
    this.deliberationService = new DeliberationService();
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
    // Get relevant agents for the query
    const relevantAgents = this.getRelevantAgents(query);
    
    // Get responses from each agent
    const agentResponses = await Promise.all(
      relevantAgents.map(agent => 
        this.agentService.getAgentResponse(agent.id, query, context)
      )
    );

    // Process deliberation
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

  private getRelevantAgents(query: string) {
    // Simple keyword-based agent selection
    const availableAgents = this.agentService.getAvailableAgents();
    
    // For now, return up to 3 agents based on availability
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

  public async submitTask(task: {
    type: string;
    content: string;
    metadata?: Record<string, any>;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<string> {
    // Generate a task ID
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`QuorumForge: Task ${taskId} submitted:`, task);
    
    return taskId;
  }

  public async waitForTaskCompletion(taskId: string, timeoutMs: number = 30000): Promise<any> {
    console.log(`QuorumForge: Waiting for task ${taskId} completion (timeout: ${timeoutMs}ms)`);
    
    // For now, simulate task completion
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          taskId,
          status: 'completed',
          result: 'Task completed successfully'
        });
      }, Math.random() * 2000); // Random delay up to 2 seconds
    });
  }
}

export const quorumForge = new QuorumForge();
