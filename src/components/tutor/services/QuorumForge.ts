
import { BaseAgent, SpecializedAgent, UserInteraction } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { LLMRouter } from './LLMRouter';
import { CouncilService } from './CouncilService';
import { DeliberationService } from './DeliberationService';
import { InteractionService } from './InteractionService';
import { AgentService } from './AgentService';
import { allSpecializedAgents } from './SpecializedAgents';
import { OpenAISwarmWrapper } from './frameworks/OpenAISwarmWrapper';
import { PydanticValidator } from './frameworks/PydanticValidator';
import { LangChainIntegration } from './frameworks/LangChainIntegration';
import { AutogenIntegration } from './frameworks/AutogenIntegration';
import { CrewAIPlanner } from './frameworks/CrewAIPlanner';
import { AgentToAgentHub } from './frameworks/AgentToAgentHub';

export class QuorumForge {
  private agentService: AgentService;
  private councilService: CouncilService;
  private deliberationService: DeliberationService;
  private interactionService: InteractionService;
  
  // New framework integrations
  private openAISwarm: OpenAISwarmWrapper;
  private pydanticValidator: PydanticValidator;
  private langChainIntegration: LangChainIntegration;
  private autogenIntegration: AutogenIntegration;
  private crewAIPlanner: CrewAIPlanner;
  private a2aHub: AgentToAgentHub;
  
  constructor(
    agents: SpecializedAgent[] = allSpecializedAgents, 
    router: LLMRouter = new LLMRouter()
  ) {
    this.agentService = new AgentService(agents);
    this.councilService = new CouncilService(agents);
    this.deliberationService = new DeliberationService();
    this.interactionService = new InteractionService(router);
    
    // Initialize framework integrations
    this.openAISwarm = new OpenAISwarmWrapper();
    this.pydanticValidator = new PydanticValidator();
    this.langChainIntegration = new LangChainIntegration(router);
    this.autogenIntegration = new AutogenIntegration(router);
    this.crewAIPlanner = new CrewAIPlanner(this.councilService);
    this.a2aHub = new AgentToAgentHub();
    
    // Initialize A2A Hub
    this.initializeA2AHub();
  }

  private initializeA2AHub(): void {
    this.a2aHub.registerCapabilities([
      'tutor', 'assessment', 'knowledge-validation', 'learning-path-design'
    ]);
    
    console.log('A2A Hub initialized on secondary port with OAuth-PKCE security');
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
    
    // Use PydanticValidator to validate input context
    const validatedContext = this.pydanticValidator.validateContext(context);
    
    // Enhanced deliberation process with CrewAI for complex topics
    if (this.shouldUseCrewAI(topic, validatedContext)) {
      const crewPlan = await this.crewAIPlanner.createPlan(topic, council, validatedContext);
      return this.deliberationService.deliberateWithPlan(
        council,
        topic,
        validatedContext,
        crewPlan,
        maxTurns,
        consensusThreshold
      );
    }
    
    return this.deliberationService.deliberate(
      council,
      topic,
      validatedContext,
      maxTurns,
      consensusThreshold
    );
  }

  private shouldUseCrewAI(topic: string, context: Record<string, any>): boolean {
    // Determine if the topic is complex enough to warrant CrewAI planning
    const topicComplexity = this.calculateTopicComplexity(topic);
    return topicComplexity > 0.7 || context.useCrewAI === true;
  }

  private calculateTopicComplexity(topic: string): number {
    // Simple heuristic for topic complexity
    const complexityWords = [
      'advanced', 'complex', 'detailed', 'comprehensive', 
      'intricate', 'sophisticated', 'multifaceted'
    ];
    
    let complexity = 0.4; // Base complexity
    
    // Increase complexity score based on matching words
    complexityWords.forEach(word => {
      if (topic.toLowerCase().includes(word)) {
        complexity += 0.1;
      }
    });
    
    // Adjust based on topic length (longer topics tend to be more complex)
    complexity += Math.min(0.2, topic.length / 500);
    
    return Math.min(1.0, complexity);
  }

  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any>
  ): Promise<UserInteraction> {
    // Validate the context using PydanticValidator
    const validatedContext = this.pydanticValidator.validateContext(context);
    
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
      context: validatedContext,
      agentResponses: []
    };

    // Check if we should use parallel processing with OpenAI Swarm
    if (council.length > 4 && !validatedContext.sequential) {
      const responses = await this.openAISwarm.processParallel(
        council,
        message,
        validatedContext
      );
      
      interaction.agentResponses = responses;
    } else {
      // Standard sequential processing
      for (const agent of council) {
        const response = await this.interactionService.processAgentResponse(
          agent,
          message,
          validatedContext
        );
        interaction.agentResponses.push(response);
      }
    }
    
    // For security-related topics, use Autogen for red-team analysis
    if (this.isSecurityRelated(message)) {
      const securityAnalysis = await this.autogenIntegration.runRedTeamAnalysis(message, validatedContext);
      interaction.securityAnalysis = securityAnalysis;
    }

    this.interactionService.addInteraction(interaction);
    return interaction;
  }

  private isSecurityRelated(message: string): boolean {
    const securityKeywords = [
      'security', 'vulnerability', 'hack', 'breach', 'attack', 
      'exploit', 'password', 'authentication', 'authorization'
    ];
    
    return securityKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  // Enhanced functionality with external agent communication
  public async communicateWithExternalAgent(
    agentId: string, 
    message: string, 
    capabilities: string[]
  ): Promise<any> {
    try {
      return await this.a2aHub.sendMessage(agentId, message, capabilities);
    } catch (error) {
      console.error("External agent communication failed:", error);
      throw new Error(`Failed to communicate with external agent: ${error.message}`);
    }
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
  
  public getLangChainOrchestrator() {
    return this.langChainIntegration;
  }
}

export const quorumForge = new QuorumForge();
