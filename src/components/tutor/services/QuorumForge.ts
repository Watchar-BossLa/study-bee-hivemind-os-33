
import { SpecializedAgent, UserInteraction } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { LLMRouter } from './LLMRouter';
import { CouncilService } from './CouncilService';
import { DeliberationService } from './DeliberationService';
import { InteractionService } from './InteractionService';
import { AgentService } from './AgentService';
import { allSpecializedAgents } from './SpecializedAgents';
import { FrameworkManager } from './core/FrameworkManager';
import { DeliberationManager } from './core/DeliberationManager';
import { InteractionManager } from './core/InteractionManager';
import { mcpCore, MCPCore } from './core/MCPCore';
import { createSeniorManagerGPT, SeniorManagerGPT } from './core/SeniorManagerGPT';
import { A2AProtocol } from './protocols/A2AProtocol';
import { createA2AHub, A2AHub } from './frameworks/A2AHub';
import { A2AOAuthHandler } from './frameworks/A2AOAuthHandler';

export class QuorumForge {
  private agentService: AgentService;
  private councilService: CouncilService;
  private frameworkManager: FrameworkManager;
  private deliberationManager: DeliberationManager;
  private interactionManager: InteractionManager;
  private mcpCore: MCPCore;
  private seniorManagerGPT: SeniorManagerGPT;
  private a2aHub: A2AHub;
  private a2aOAuthHandler: A2AOAuthHandler;
  
  constructor(
    agents: SpecializedAgent[] = allSpecializedAgents, 
    router: LLMRouter = new LLMRouter()
  ) {
    // Initialize services
    this.agentService = new AgentService(agents);
    this.councilService = new CouncilService(agents);
    
    const deliberationService = new DeliberationService();
    const interactionService = new InteractionService(router);
    
    // Initialize MCP-Core and related components
    this.mcpCore = mcpCore;
    this.a2aOAuthHandler = new A2AOAuthHandler();
    this.a2aHub = createA2AHub(this.a2aOAuthHandler, this.mcpCore);
    this.seniorManagerGPT = createSeniorManagerGPT(this.mcpCore, this.councilService);
    
    // Register all agents with MCP-Core
    agents.forEach(agent => {
      this.mcpCore.registerAgent(agent);
    });
    
    // Initialize framework manager with A2A integration
    this.frameworkManager = new FrameworkManager(this.councilService, router);
    
    // Initialize managers
    this.deliberationManager = new DeliberationManager(
      deliberationService,
      this.councilService,
      this.frameworkManager
    );
    
    this.interactionManager = new InteractionManager(
      interactionService,
      this.councilService,
      this.frameworkManager
    );
    
    // Integrate A2A Hub with MCP-Core
    this.a2aHub.integrateMCPCore(this.mcpCore);
    
    // Register local capabilities with A2A Hub
    this.a2aHub.registerCapabilities([
      'quorum-deliberation',
      'agent-coordination',
      'learning-path-design',
      'adaptive-assessment',
      'personalized-tutoring'
    ]);
    
    console.log('QuorumForge initialized with MCP-Core and A2A Protocol');
  }
  
  // Agent Task Management via MCP-Core
  
  /**
   * Submit a task to be processed by a specific agent
   * @param agentId The agent to process the task
   * @param taskType The type of task
   * @param content The task content
   * @param priority Task priority
   */
  public async submitAgentTask(
    agentId: string,
    taskType: string,
    content: any,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): Promise<string> {
    const priorityMap = {
      'low': 0,
      'normal': 1,
      'high': 2,
      'critical': 3
    };
    
    return this.mcpCore.submitTask({
      agentId,
      type: taskType,
      content,
      priority: priorityMap[priority]
    });
  }
  
  /**
   * Get the status of a task
   * @param taskId The task ID
   */
  public getTaskStatus(taskId: string): { status: string; result?: any } {
    const task = this.mcpCore.getTask(taskId);
    
    if (!task) {
      return { status: 'unknown' };
    }
    
    return {
      status: task.status,
      result: task.result
    };
  }
  
  // Agent-to-Agent Communication
  
  /**
   * Send a message from one agent to another
   * @param fromAgentId Source agent ID
   * @param toAgentId Target agent ID
   * @param message The message content
   */
  public async sendAgentMessage(
    fromAgentId: string,
    toAgentId: string,
    message: any
  ): Promise<string> {
    return this.mcpCore.sendMessage({
      fromAgentId,
      toAgentId,
      content: message,
      type: 'direct'
    });
  }
  
  // External Agent Communication via A2A Hub
  
  /**
   * Communicate with an external agent through A2A protocol
   * @param agentId External agent ID
   * @param message Message to send
   * @param capabilities Required capabilities
   */
  public async communicateWithExternalAgent(
    agentId: string, 
    message: string, 
    capabilities: string[]
  ): Promise<any> {
    try {
      const response = await this.a2aHub.sendMessage(agentId, message, {
        requiredCapabilities: capabilities
      });
      
      return response.body.content;
    } catch (error) {
      console.error("External agent communication failed:", error);
      throw new Error(`Failed to communicate with external agent: ${(error as Error).message}`);
    }
  }
  
  /**
   * Route a message to any agent with the required capability
   * @param capability The required capability
   * @param message The message content
   */
  public async routeMessageByCapability(
    capability: string,
    message: any
  ): Promise<any> {
    const response = await this.a2aHub.routeMessageByCapability(capability, message);
    return response?.body.content;
  }
  
  /**
   * Discover available capabilities across all agents
   */
  public async discoverCapabilities(): Promise<string[]> {
    const capabilities = await this.a2aHub.discoverCapabilities();
    return capabilities.map(cap => cap.capability);
  }
  
  // Plan Review via SeniorManagerGPT
  
  /**
   * Submit a plan for review by SeniorManagerGPT
   * @param plan The plan to review
   * @param context Additional context for the review
   */
  public async reviewPlan(plan: any, context: Record<string, any> = {}): Promise<any> {
    return this.seniorManagerGPT.reviewPlan(plan, context);
  }
  
  // Original methods from QuorumForge
  
  /**
   * Deliberate on a topic using a council
   */
  public async deliberate(
    councilId: string, 
    topic: string, 
    context: Record<string, any>,
    maxTurns: number = 3, 
    consensusThreshold: number = 0.8
  ): Promise<CouncilDecision> {
    return this.deliberationManager.deliberate(
      councilId, 
      topic, 
      context, 
      maxTurns, 
      consensusThreshold
    );
  }

  /**
   * Process a user interaction
   */
  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any>
  ): Promise<UserInteraction> {
    return this.interactionManager.processInteraction(message, userId, context);
  }

  // Agent management methods
  
  /**
   * Get all agents
   */
  public getAgents(): SpecializedAgent[] {
    return this.agentService.getAgents();
  }

  /**
   * Get all councils
   */
  public getCouncils(): Map<string, SpecializedAgent[]> {
    return this.councilService.getAllCouncils();
  }

  /**
   * Get recent decisions
   */
  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.deliberationManager.getRecentDecisions(limit);
  }

  /**
   * Get recent interactions
   */
  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactionManager.getRecentInteractions(limit);
  }
  
  /**
   * Get agent performance metrics
   */
  public getAgentPerformanceMetrics(agentId: string) {
    return this.interactionManager.getAgentPerformanceMetrics(agentId);
  }
  
  /**
   * Get all agent performance metrics
   */
  public getAllAgentPerformanceMetrics() {
    return this.interactionManager.getAllAgentPerformanceMetrics();
  }
  
  /**
   * Record feedback
   */
  public recordFeedback(
    interactionId: string, 
    userId: string, 
    rating: number, 
    agentFeedback?: Record<string, number>,
    comments?: string
  ) {
    this.interactionManager.recordFeedback(
      interactionId,
      userId,
      rating,
      agentFeedback,
      comments
    );
  }
  
  /**
   * Get user top interests
   */
  public getUserTopInterests(userId: string, limit: number = 5) {
    return this.interactionManager.getUserTopInterests(userId, limit);
  }
  
  /**
   * Get LangChain orchestrator
   */
  public getLangChainOrchestrator() {
    return this.frameworkManager.getLangChainIntegration();
  }
  
  /**
   * Get MCP-Core instance
   */
  public getMCPCore() {
    return this.mcpCore;
  }
  
  /**
   * Get A2A Hub instance
   */
  public getA2AHub() {
    return this.a2aHub;
  }
}

// Export a singleton instance
export const quorumForge = new QuorumForge();
