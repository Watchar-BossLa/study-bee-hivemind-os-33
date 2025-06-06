
import { SpecializedAgent } from '../../types/agents';
import { RouterRequest } from '../../types/router';
import { LLMRouter } from '../LLMRouter';
import { PydanticValidator } from '../frameworks/PydanticValidator';

export class AgentResponseProcessor {
  private router: LLMRouter;
  private userModelSuccessRates: Map<string, Record<string, number>>;
  private pydanticValidator: PydanticValidator;
  
  constructor(router: LLMRouter) {
    this.router = router;
    this.userModelSuccessRates = new Map();
    this.pydanticValidator = new PydanticValidator();
  }

  public async processAgentResponse(
    agent: SpecializedAgent,
    message: string,
    context: Record<string, any>
  ) {
    agent.status = 'busy';
    
    try {
      const validatedContext = this.pydanticValidator.validateContext(context);
      
      const routerRequest = this.createRouterRequest(message, validatedContext);
      const modelSelection = await this.router.selectModel(routerRequest);
      
      const startTime = Date.now();
      const { processingTime, expertiseMatch } = await this.simulateProcessing(agent, message);
      
      const confidenceScore = this.calculateConfidenceScore(agent, expertiseMatch);
      const agentSpecificResponse = this.generateAgentResponse(agent, message, validatedContext);
      
      const response = this.prepareResponse(
        agent, 
        agentSpecificResponse, 
        modelSelection, 
        confidenceScore, 
        startTime
      );
      
      const validatedResponse = this.pydanticValidator.validatePlan(response);
      
      this.updateMetrics(agent, modelSelection.modelId, routerRequest, processingTime, validatedContext, confidenceScore);
      
      return validatedResponse;
    } catch (error) {
      this.handleError(agent, message, error);
      throw error;
    } finally {
      agent.status = 'idle';
    }
  }

  private createRouterRequest(message: string, context: Record<string, any>): RouterRequest {
    return {
      query: message,
      task: 'tutor',
      complexity: context.complexity || 'medium',
      urgency: context.urgency || 'medium',
      costSensitivity: context.costSensitivity || 'medium',
      contextLength: message.length + (context.additionalContext?.length || 0),
      userSkillLevel: context.userSkillLevel || 'intermediate',
      topicId: context.topicId,
      preferredModality: context.preferredModality || 'text'
    };
  }

  private async simulateProcessing(agent: SpecializedAgent, message: string) {
    const expertiseMatch = agent.expertise.some((exp: string) => 
      message.toLowerCase().includes(exp.toLowerCase())
    );
    
    const processingTime = expertiseMatch ? 
      agent.performance.responseTime * 0.8 : 
      agent.performance.responseTime * 1.2;
    
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    return { processingTime, expertiseMatch };
  }

  private calculateConfidenceScore(agent: SpecializedAgent, expertiseMatch: boolean): number {
    const baseConfidence = expertiseMatch ? 0.85 : 0.75;
    const adaptabilityFactor = (agent.adaptability || 0.5) * 0.1;
    const specialtyBonus = expertiseMatch && (agent.specializationDepth || 0.5) * 0.15;
    
    return Math.min(0.98, baseConfidence + adaptabilityFactor + (specialtyBonus || 0));
  }

  private generateAgentResponse(
    agent: SpecializedAgent, 
    message: string, 
    context: Record<string, any>
  ): string {
    return `${agent.name} response [Role: ${agent.role}] tailored for ${context.userSkillLevel || 'intermediate'} level student.`;
  }

  private prepareResponse(
    agent: SpecializedAgent,
    response: string,
    modelSelection: any,
    confidenceScore: number,
    startTime: number
  ) {
    return {
      agentId: agent.id,
      response,
      modelUsed: modelSelection.modelId,
      confidenceScore,
      processingTimeMs: Date.now() - startTime,
      fallbackModels: modelSelection.fallbackOptions || [],
      reasoningTrace: modelSelection.reasoningTrace || [],
      validatedSchema: true
    };
  }

  private updateMetrics(
    agent: SpecializedAgent,
    modelId: string,
    request: RouterRequest,
    processingTime: number,
    context: Record<string, any>,
    confidenceScore: number
  ) {
    this.router.logSelection(modelId, request, true, processingTime);
    
    if (agent.performanceHistory && agent.performanceHistory.lastInteractions) {
      agent.performanceHistory.lastInteractions = [
        {
          timestamp: new Date(),
          confidenceScore,
          topicId: context.topicId || 'general'
        },
        ...agent.performanceHistory.lastInteractions
      ].slice(0, 10);
    }
    
    if (context.userId) {
      this.updateUserMetrics(context.userId, modelId, context.topicId);
    }
  }

  private updateUserMetrics(userId: string, modelId: string, topicId?: string) {
    let userRates = this.userModelSuccessRates.get(userId) || {};
    userRates[modelId] = (userRates[modelId] || 0.5) + 0.1;
    this.userModelSuccessRates.set(userId, userRates);
  }

  private async handleError(agent: SpecializedAgent, message: string, error: any) {
    console.error("Error in agent response processing:", error);
    
    const routerRequest: RouterRequest = {
      query: message,
      task: 'tutor',
      complexity: 'medium',
      urgency: 'medium',
      costSensitivity: 'medium'
    };
    
    try {
      const selectedModel = await this.router.selectModel(routerRequest);
      this.router.logSelection(selectedModel.modelId, routerRequest, false);
    } catch (routerError) {
      console.error("Could not select model for error logging:", routerError);
    }
  }
}
