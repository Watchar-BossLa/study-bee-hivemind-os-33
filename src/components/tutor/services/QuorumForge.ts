
import { SpecializedAgent } from '../types/agents';
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
import { createA2AHub, A2AHub } from './frameworks/A2AHub';
import { A2AOAuthHandler } from './frameworks/A2AOAuthHandler';
import { AgentCommunication } from './quorum-forge/AgentCommunication';
import { AgentTaskManager } from './quorum-forge/AgentTaskManager';
import { CouncilDeliberation } from './quorum-forge/CouncilDeliberation';
import { UserInteractionManager } from './quorum-forge/UserInteractionManager';
import { AgentRegistry } from './quorum-forge/AgentRegistry';
import { SeniorManager } from './quorum-forge/SeniorManager';

export class QuorumForge {
  // Core services
  private mcpCore: MCPCore;
  private seniorManagerGPT: SeniorManagerGPT;
  private a2aHub: A2AHub;
  
  // Refactored modules
  private agentCommunication: AgentCommunication;
  private agentTaskManager: AgentTaskManager;
  private councilDeliberation: CouncilDeliberation;
  private userInteractionManager: UserInteractionManager;
  private agentRegistry: AgentRegistry;
  private seniorManager: SeniorManager;
  
  // Original services (kept for compatibility)
  private agentService: AgentService;
  private councilService: CouncilService;
  private frameworkManager: FrameworkManager;
  private deliberationManager: DeliberationManager;
  private interactionManager: InteractionManager;
  
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
    const a2aOAuthHandler = new A2AOAuthHandler();
    this.a2aHub = createA2AHub(a2aOAuthHandler, this.mcpCore);
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
    
    // Initialize refactored modules
    this.agentCommunication = new AgentCommunication(this.mcpCore, this.a2aHub);
    this.agentTaskManager = new AgentTaskManager(this.mcpCore);
    this.councilDeliberation = new CouncilDeliberation(this.deliberationManager);
    this.userInteractionManager = new UserInteractionManager(this.interactionManager);
    this.agentRegistry = new AgentRegistry(this.agentService, this.councilService);
    this.seniorManager = new SeniorManager(this.seniorManagerGPT);
    
    console.log('QuorumForge initialized with MCP-Core and A2A Protocol');
  }
  
  // ==========================================
  // Agent Task Management via MCP-Core
  // ==========================================
  
  /**
   * Submit a task to be processed by a specific agent
   */
  public async submitAgentTask(
    agentId: string,
    taskType: string,
    content: any,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): Promise<string> {
    return this.agentTaskManager.submitAgentTask(agentId, taskType, content, priority);
  }
  
  /**
   * Get the status of a task
   */
  public getTaskStatus(taskId: string): { status: string; result?: any } {
    return this.agentTaskManager.getTaskStatus(taskId);
  }
  
  // ==========================================
  // Agent-to-Agent Communication
  // ==========================================
  
  /**
   * Send a message from one agent to another
   */
  public async sendAgentMessage(
    fromAgentId: string,
    toAgentId: string,
    message: any
  ): Promise<string> {
    return this.agentCommunication.sendAgentMessage(fromAgentId, toAgentId, message);
  }
  
  // ==========================================
  // External Agent Communication via A2A Hub
  // ==========================================
  
  /**
   * Communicate with an external agent through A2A protocol
   */
  public async communicateWithExternalAgent(
    agentId: string, 
    message: string, 
    capabilities: string[]
  ): Promise<any> {
    return this.agentCommunication.communicateWithExternalAgent(agentId, message, capabilities);
  }
  
  /**
   * Route a message to any agent with the required capability
   */
  public async routeMessageByCapability(
    capability: string,
    message: any
  ): Promise<any> {
    return this.agentCommunication.routeMessageByCapability(capability, message);
  }
  
  /**
   * Discover available capabilities across all agents
   */
  public async discoverCapabilities(): Promise<string[]> {
    return this.agentCommunication.discoverCapabilities();
  }
  
  // ==========================================
  // Plan Review via SeniorManagerGPT
  // ==========================================
  
  /**
   * Submit a plan for review by SeniorManagerGPT
   */
  public async reviewPlan(plan: any, context: Record<string, any> = {}): Promise<any> {
    return this.seniorManager.reviewPlan(plan, context);
  }
  
  // ==========================================
  // Council Deliberation
  // ==========================================
  
  /**
   * Deliberate on a topic using a council
   */
  public async deliberate(
    councilId: string, 
    topic: string, 
    context: Record<string, any>,
    maxTurns: number = 3, 
    consensusThreshold: number = 0.8
  ): Promise<any> {
    return this.councilDeliberation.deliberate(
      councilId, 
      topic, 
      context, 
      maxTurns, 
      consensusThreshold
    );
  }

  // ==========================================
  // User Interaction
  // ==========================================
  
  /**
   * Process a user interaction
   */
  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any>
  ): Promise<any> {
    return this.userInteractionManager.processInteraction(message, userId, context);
  }

  // ==========================================
  // Agent & Council Registry
  // ==========================================
  
  /**
   * Get all agents
   */
  public getAgents(): SpecializedAgent[] {
    return this.agentRegistry.getAgents();
  }

  /**
   * Get all councils
   */
  public getCouncils(): Map<string, SpecializedAgent[]> {
    return this.agentRegistry.getCouncils();
  }

  /**
   * Get recent decisions
   */
  public getRecentDecisions(limit: number = 10): any[] {
    return this.councilDeliberation.getRecentDecisions(limit);
  }

  /**
   * Get recent interactions
   */
  public getRecentInteractions(limit: number = 10): any[] {
    return this.userInteractionManager.getRecentInteractions(limit);
  }
  
  /**
   * Get agent performance metrics
   */
  public getAgentPerformanceMetrics(agentId: string) {
    return this.userInteractionManager.getAgentPerformanceMetrics(agentId);
  }
  
  /**
   * Get all agent performance metrics
   */
  public getAllAgentPerformanceMetrics() {
    return this.userInteractionManager.getAllAgentPerformanceMetrics();
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
    this.userInteractionManager.recordFeedback(
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
    return this.userInteractionManager.getUserTopInterests(userId, limit);
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
