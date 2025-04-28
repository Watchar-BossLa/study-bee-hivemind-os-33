
import { UserInteraction, SpecializedAgent, AgentPerformanceMetrics } from '../types/agents';
import { LLMRouter } from './LLMRouter';
import { RouterRequest } from '../types/router';

export class InteractionService {
  private interactions: UserInteraction[] = [];
  private router: LLMRouter;
  private userModelSuccessRates: Map<string, Record<string, number>> = new Map();
  private agentPerformanceMetrics: Map<string, AgentPerformanceMetrics> = new Map();
  private userTopicInterests: Map<string, Record<string, number>> = new Map();

  constructor(router: LLMRouter) {
    this.router = router;
  }

  public async processAgentResponse(
    agent: SpecializedAgent,
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
        topicId: context.topicId,
        preferredModality: context.preferredModality || 'text'
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
      
      // Simulate agent processing time - adjusted based on agent's expertise match
      const expertiseMatch = agent.expertise.some((exp: string) => 
        message.toLowerCase().includes(exp.toLowerCase())
      );
      
      // Faster response time if agent has direct expertise
      const processingTime = expertiseMatch ? 
        agent.performance.responseTime * 0.8 : 
        agent.performance.responseTime * 1.2;
      
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Calculate confidence score (0.7-1.0) with added nuance based on agent attributes
      const baseConfidence = expertiseMatch ? 0.85 : 0.75;
      const adaptabilityFactor = (agent.adaptability || 0.5) * 0.1;
      const specialtyBonus = expertiseMatch && (agent.specializationDepth || 0.5) * 0.15;
      
      const confidenceScore = Math.min(0.98, baseConfidence + adaptabilityFactor + (specialtyBonus || 0));
      
      // Generate response based on agent expertise and topic
      const agentSpecificResponse = this.generateAgentSpecificResponse(agent, message, context);
      
      // Prepare response with enhanced metadata
      const response = {
        agentId: agent.id,
        response: agentSpecificResponse,
        modelUsed: selectedModel.id,
        confidenceScore,
        processingTimeMs: Date.now() - startTime,
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
      
      // Update agent performance history if available
      if (agent.performanceHistory) {
        agent.performanceHistory.lastInteractions = [
          {
            timestamp: new Date(),
            confidenceScore,
            topicId: context.topicId || 'general'
          },
          ...agent.performanceHistory.lastInteractions || []
        ].slice(0, 10); // Keep only the last 10 interactions
      }
      
      // Update user-specific model success rates
      if (context.userId) {
        let userRates = this.userModelSuccessRates.get(context.userId) || {};
        userRates[selectedModel.id] = (userRates[selectedModel.id] || 0.5) + 0.1;
        this.userModelSuccessRates.set(context.userId, userRates);
        
        // Track user topic interests
        if (context.topicId) {
          let userTopics = this.userTopicInterests.get(context.userId) || {};
          userTopics[context.topicId] = (userTopics[context.topicId] || 0) + 1;
          this.userTopicInterests.set(context.userId, userTopics);
        }
      }
      
      // Update agent performance metrics
      this.updateAgentPerformanceMetrics(agent.id, {
        successful: true,
        confidenceScore,
        topicId: context.topicId,
        domain: context.domain || agent.domain
      });
      
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
      
      // Update agent performance metrics for failure
      this.updateAgentPerformanceMetrics(agent.id, {
        successful: false,
        topicId: context.topicId,
        domain: context.domain || agent.domain
      });
      
      throw error;
    } finally {
      agent.status = 'idle';
    }
  }
  
  private generateAgentSpecificResponse(
    agent: SpecializedAgent, 
    message: string, 
    context: Record<string, any>
  ): string {
    // This is a placeholder for actual agent-specific response generation
    // In a real implementation, this would use the agent's expertise to generate a response
    
    const agentRole = agent.role;
    const userSkillLevel = context.userSkillLevel || 'intermediate';
    
    return `${agent.name} response [Role: ${agentRole}] tailored for ${userSkillLevel} level student.`;
  }
  
  private updateAgentPerformanceMetrics(
    agentId: string, 
    interaction: {
      successful: boolean,
      confidenceScore?: number,
      topicId?: string,
      domain?: string,
      userFeedback?: number
    }
  ): void {
    let metrics = this.agentPerformanceMetrics.get(agentId);
    
    if (!metrics) {
      // Initialize metrics if first time
      metrics = {
        overallAccuracy: interaction.successful ? 1 : 0,
        userFeedbackAverage: interaction.userFeedback || 0,
        responseTimeAverage: 0,
        domainSpecificPerformance: {},
        topicPerformance: {},
        improvementRate: 0,
        lastUpdated: new Date()
      };
    } else {
      // Update existing metrics
      const oldCount = Object.keys(metrics.topicPerformance).length + 
                      Object.keys(metrics.domainSpecificPerformance).length || 1;
      
      // Update overall accuracy
      metrics.overallAccuracy = (metrics.overallAccuracy * oldCount + (interaction.successful ? 1 : 0)) / (oldCount + 1);
      
      // Update user feedback if provided
      if (interaction.userFeedback) {
        metrics.userFeedbackAverage = (metrics.userFeedbackAverage * oldCount + interaction.userFeedback) / (oldCount + 1);
      }
      
      // Update last updated timestamp
      metrics.lastUpdated = new Date();
    }
    
    // Update domain specific performance
    if (interaction.domain) {
      const currentDomainPerf = metrics.domainSpecificPerformance[interaction.domain] || 0.5;
      metrics.domainSpecificPerformance[interaction.domain] = 
        (currentDomainPerf + (interaction.successful ? 1 : 0)) / 2;
    }
    
    // Update topic specific performance
    if (interaction.topicId) {
      const currentTopicPerf = metrics.topicPerformance[interaction.topicId] || 0.5;
      metrics.topicPerformance[interaction.topicId] = 
        (currentTopicPerf + (interaction.successful ? 1 : 0)) / 2;
    }
    
    // Save updated metrics
    this.agentPerformanceMetrics.set(agentId, metrics);
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
  
  public getAgentPerformanceMetrics(agentId: string): AgentPerformanceMetrics | undefined {
    return this.agentPerformanceMetrics.get(agentId);
  }
  
  public getAllAgentPerformanceMetrics(): Map<string, AgentPerformanceMetrics> {
    return new Map(this.agentPerformanceMetrics);
  }
  
  public getTopPerformingAgentsForTopic(topicId: string, limit: number = 3): string[] {
    const agentScores: {agentId: string, score: number}[] = [];
    
    this.agentPerformanceMetrics.forEach((metrics, agentId) => {
      const topicScore = metrics.topicPerformance[topicId] || 0;
      const overallScore = metrics.overallAccuracy;
      // Weight topic-specific performance more heavily
      const combinedScore = topicScore * 0.7 + overallScore * 0.3;
      
      agentScores.push({agentId, score: combinedScore});
    });
    
    return agentScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.agentId);
  }
  
  public recordUserFeedback(
    interactionId: string, 
    userId: string, 
    rating: number, 
    agentFeedback?: Record<string, number>,
    comments?: string
  ): void {
    // Find the interaction
    const interaction = this.interactions.find(i => i.id === interactionId);
    if (!interaction) return;
    
    // Update the interaction with user feedback
    interaction.userFeedback = {
      rating,
      comments,
      helpfulAgents: agentFeedback ? 
        Object.entries(agentFeedback)
          .filter(([_, score]) => score >= 4)
          .map(([agentId, _]) => agentId) : 
        undefined
    };
    
    // Update agent-specific metrics based on feedback
    if (agentFeedback) {
      Object.entries(agentFeedback).forEach(([agentId, score]) => {
        this.updateAgentPerformanceMetrics(agentId, {
          successful: score >= 3,
          userFeedback: score,
          topicId: interaction.context.topicId
        });
      });
    }
  }
  
  public getUserTopInterests(userId: string, limit: number = 5): string[] {
    const userTopics = this.userTopicInterests.get(userId);
    if (!userTopics) return [];
    
    return Object.entries(userTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([topicId, _]) => topicId);
  }
}
