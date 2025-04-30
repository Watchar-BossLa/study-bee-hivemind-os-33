
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

export class QuorumForge {
  private agentService: AgentService;
  private councilService: CouncilService;
  private frameworkManager: FrameworkManager;
  private deliberationManager: DeliberationManager;
  private interactionManager: InteractionManager;
  
  constructor(
    agents: SpecializedAgent[] = allSpecializedAgents, 
    router: LLMRouter = new LLMRouter()
  ) {
    this.agentService = new AgentService(agents);
    this.councilService = new CouncilService(agents);
    
    const deliberationService = new DeliberationService();
    const interactionService = new InteractionService(router);
    
    // Initialize framework manager
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
  }
  
  // Deliberation methods
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

  // Interaction methods
  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any>
  ): Promise<UserInteraction> {
    return this.interactionManager.processInteraction(message, userId, context);
  }

  // External agent communication
  public async communicateWithExternalAgent(
    agentId: string, 
    message: string, 
    capabilities: string[]
  ): Promise<any> {
    return this.frameworkManager.communicateWithExternalAgent(
      agentId, 
      message, 
      capabilities
    );
  }

  // Agent methods
  public getAgents(): SpecializedAgent[] {
    return this.agentService.getAgents();
  }

  // Council methods
  public getCouncils(): Map<string, SpecializedAgent[]> {
    return this.councilService.getAllCouncils();
  }

  // Decision retrieval
  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.deliberationManager.getRecentDecisions(limit);
  }

  // Interaction retrieval
  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactionManager.getRecentInteractions(limit);
  }
  
  // Performance metrics
  public getAgentPerformanceMetrics(agentId: string) {
    return this.interactionManager.getAgentPerformanceMetrics(agentId);
  }
  
  public getAllAgentPerformanceMetrics() {
    return this.interactionManager.getAllAgentPerformanceMetrics();
  }
  
  // Feedback recording
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
  
  // User interest retrieval
  public getUserTopInterests(userId: string, limit: number = 5) {
    return this.interactionManager.getUserTopInterests(userId, limit);
  }
  
  // LangChain orchestrator access
  public getLangChainOrchestrator() {
    return this.frameworkManager.getLangChainIntegration();
  }
}

export const quorumForge = new QuorumForge();
