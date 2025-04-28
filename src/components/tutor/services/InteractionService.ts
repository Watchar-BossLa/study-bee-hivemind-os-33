
import { UserInteraction } from '../types/agents';
import { LLMRouter } from './LLMRouter';
import { RouterRequest } from '../types/router';

export class InteractionService {
  private interactions: UserInteraction[] = [];
  private router: LLMRouter;
  private userModelSuccessRates: Map<string, Record<string, number>> = new Map();

  constructor(router: LLMRouter) {
    this.router = router;
  }

  public async processAgentResponse(
    agent: any,
    message: string,
    context: Record<string, any>
  ) {
    agent.status = 'busy';
    
    try {
      // Enhanced router request with more context information
      const routerRequest: RouterRequest = {
        query: message,
        task: 'tutor' as const,
        complexity: context.complexity || 'medium',
        urgency: context.urgency || 'medium',
        costSensitivity: context.costSensitivity || 'medium',
        contextLength: message.length + (context.additionalContext?.length || 0),
        userSkillLevel: context.userSkillLevel || 'intermediate',
        topicId: context.topicId
      };
      
      // Get user-specific model success rates if available
      if (context.userId && this.userModelSuccessRates.has(context.userId)) {
        routerRequest.previousSuccess = this.userModelSuccessRates.get(context.userId);
      }
      
      // Get detailed model selection with fallback options
      const modelSelection = this.router.getDetailedSelection(routerRequest);
      const selectedModel = this.router.selectModel(routerRequest);
      
      // Track start time to measure performance
      const startTime = Date.now();
      
      // Simulate agent processing time
      await new Promise(resolve => setTimeout(resolve, agent.performance.responseTime));
      
      // Calculate response time
      const processingTime = Date.now() - startTime;
      
      // Generate confidence score (0.7-1.0) with some variability based on agent expertise
      const expertiseMatch = agent.expertise.some((exp: string) => 
        message.toLowerCase().includes(exp.toLowerCase())
      );
      const baseConfidence = expertiseMatch ? 0.85 : 0.75;
      const confidenceScore = Math.min(0.98, baseConfidence + (Math.random() * 0.15));
      
      // Prepare response with enhanced metadata
      const response = {
        agentId: agent.id,
        response: `${agent.name} response using ${selectedModel.name}`,
        modelUsed: selectedModel.id,
        confidenceScore,
        processingTimeMs: processingTime,
        fallbackModels: modelSelection.fallbackOptions,
        reasoningTrace: modelSelection.reasoningTrace
      };
      
      // Log this selection as successful
      this.router.logSelection(
        selectedModel.id, 
        routerRequest, 
        true, 
        processingTime
      );
      
      // Update user-specific model success rates
      if (context.userId) {
        let userRates = this.userModelSuccessRates.get(context.userId) || {};
        userRates[selectedModel.id] = (userRates[selectedModel.id] || 0.5) + 0.1;
        this.userModelSuccessRates.set(context.userId, userRates);
      }
      
      return response;
    } catch (error) {
      console.error("Error in agent response processing:", error);
      
      // If there was an error, log an unsuccessful selection
      const routerRequest: RouterRequest = {
        query: message,
        task: 'tutor',
        complexity: 'medium',
        urgency: 'medium',
        costSensitivity: 'medium'
      };
      
      // Try to get a model even though there was an error
      try {
        const selectedModel = this.router.selectModel(routerRequest);
        this.router.logSelection(selectedModel.id, routerRequest, false);
      } catch (routerError) {
        console.error("Could not select model for error logging:", routerError);
      }
      
      throw error;
    } finally {
      agent.status = 'idle';
    }
  }

  public addInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
  }

  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactions.slice(-limit);
  }
  
  public getUserSuccessRates(userId: string): Record<string, number> | undefined {
    return this.userModelSuccessRates.get(userId);
  }
  
  public clearUserSuccessRates(userId: string): void {
    this.userModelSuccessRates.delete(userId);
  }
}
