
import { SpecializedAgent, Council, Plan, DeliberationResult } from '../types/agents';
import { AgentService } from './AgentService';
import { LLMRouter } from './LLMRouter';
import { DeliberationService } from './DeliberationService';

/**
 * QuorumForge - The main orchestrator for agent-based deliberation
 */
export class QuorumForge {
  private agentService: AgentService;
  private llmRouter: LLMRouter;
  private deliberationService: DeliberationService;
  
  constructor(llmRouter: LLMRouter) {
    this.llmRouter = llmRouter;
    this.agentService = new AgentService(llmRouter);
    this.deliberationService = new DeliberationService();
  }
  
  /**
   * Create a specialized council for a given topic
   */
  public async createCouncil(topic: string, agentTypes: string[]): Promise<Council> {
    const agents: SpecializedAgent[] = [];
    
    for (const agentType of agentTypes) {
      const agent = await this.agentService.createAgent(agentType, topic);
      if (agent) {
        agents.push(agent);
      }
    }
    
    const council: Council = {
      id: `council-${Date.now()}`,
      name: `${topic} Council`,
      topic,
      agents,
      createdAt: new Date(),
      isActive: true
    };
    
    return council;
  }
  
  /**
   * Run a deliberation process with a council
   */
  public async deliberate(council: Council, query: string): Promise<DeliberationResult> {
    console.log(`Starting deliberation for council ${council.id} on query: ${query}`);
    
    // Generate initial responses from all agents
    const agentResponses = await Promise.all(
      council.agents.map(async (agent) => {
        try {
          const response = await this.agentService.getAgentResponse(agent, query);
          return {
            agentId: agent.id,
            response,
            confidence: Math.random() * 0.4 + 0.6 // Random confidence between 0.6-1.0
          };
        } catch (error) {
          console.error(`Error getting response from agent ${agent.id}:`, error);
          return {
            agentId: agent.id,
            response: 'I was unable to provide a response at this time.',
            confidence: 0.1
          };
        }
      })
    );
    
    // Run deliberation process
    const deliberationResult = await this.deliberationService.processDeliberation(
      agentResponses,
      query,
      council.id
    );
    
    return deliberationResult;
  }
  
  /**
   * Create a plan based on deliberation results
   */
  public async createPlan(deliberationResult: DeliberationResult): Promise<Plan> {
    const plan: Plan = {
      id: `plan-${Date.now()}`,
      title: `Action Plan for ${deliberationResult.topic}`,
      description: deliberationResult.consensusResponse,
      tasks: deliberationResult.recommendations.map((rec, index) => ({
        id: `task-${index + 1}`,
        title: `Task ${index + 1}`,
        description: rec,
        priority: index + 1,
        status: 'pending' as const,
        estimatedTime: 30
      })),
      status: 'draft' as const,
      createdAt: new Date(),
      createdBy: 'quorum-forge'
    };
    
    return plan;
  }
  
  /**
   * Execute a plan with the appropriate agents
   */
  public async executePlan(plan: Plan, council: Council): Promise<{
    success: boolean;
    results: Array<{ taskId: string; result: string; success: boolean }>;
  }> {
    console.log(`Executing plan ${plan.id} with council ${council.id}`);
    
    const results = await Promise.all(
      plan.tasks.map(async (task) => {
        try {
          // Select appropriate agent for the task
          const agent = council.agents[0]; // Simplified selection
          const result = await this.agentService.getAgentResponse(agent, 
            `Execute this task: ${task.description}`
          );
          
          return {
            taskId: task.id,
            result,
            success: true
          };
        } catch (error) {
          console.error(`Error executing task ${task.id}:`, error);
          return {
            taskId: task.id,
            result: 'Task execution failed',
            success: false
          };
        }
      })
    );
    
    const success = results.every(r => r.success);
    
    return { success, results };
  }
}
