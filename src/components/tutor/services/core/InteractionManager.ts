import { InteractionService } from '../InteractionService';
import { CouncilService } from '../CouncilService';
import { FrameworkManager } from './FrameworkManager';
import { LLMRouter } from '../LLMRouter';
import { MCPCore } from './MCPCore';

export class InteractionManager {
  private interactionService: InteractionService;
  private councilService: CouncilService;
  private frameworkManager: FrameworkManager;
  private mcpCore?: MCPCore;
  
  constructor(
    interactionService: InteractionService,
    councilService: CouncilService,
    frameworkManager: FrameworkManager,
    mcpCore?: MCPCore
  ) {
    this.interactionService = interactionService;
    this.councilService = councilService;
    this.frameworkManager = frameworkManager;
    this.mcpCore = mcpCore;
  }
  
  public async processInteraction(
    message: string, 
    userId: string, 
    context: Record<string, any> = {}
  ): Promise<any> {
    // Determine the appropriate council
    const councilId = this.councilService.determineCouncilForMessage(message);
    const council = this.councilService.getCouncil(councilId);
    
    if (!council) {
      throw new Error(`Council ${councilId} not found`);
    }
    
    // First attempt: use MCP if available
    if (this.mcpCore) {
      try {
        const taskId = await this.mcpCore.submitTask({
          type: 'interaction',
          content: message,
          metadata: {
            userId,
            context
          },
          priority: context.urgency === 'high' ? 'high' : 'normal'
        });
        
        // Wait for task completion
        const result = await this.mcpCore.waitForTaskCompletion(taskId, 60000); // 60-second timeout
        
        if (result) {
          return result;
        }
        
        // If MCP doesn't return a result, fall back to direct processing
      } catch (error) {
        console.error('MCP processing failed, falling back to direct processing:', error);
      }
    }
    
    // Process agents in parallel
    const agentResponses = await this.interactionService.processAgentResponses(
      council,
      message,
      context
    );
    
    // Format agent responses
    const formattedResponses = agentResponses.map(response => ({
      agentId: response.agentId || 'unknown',
      response: response.response || 'No response',
      modelUsed: response.modelUsed || 'unknown',
      confidenceScore: response.confidenceScore || 0.5,
      processingTimeMs: response.processingTimeMs || 0
    }));
    
    // Combine responses
    const combinedResponse = await this.interactionService.combineAgentResponses(
      formattedResponses,
      message,
      context
    );
    
    return {
      response: combinedResponse,
      agentResponses: formattedResponses,
      councilId,
      processedBy: 'direct'
    };
  }
  
  public recordFeedback(
    interactionId: string,
    userId: string,
    rating: number,
    agentFeedback?: Record<string, number>,
    comments?: string
  ): void {
    console.log(`Recording feedback for interaction ${interactionId} from user ${userId}`);
    
    // In a real implementation, this would store the feedback in a database
    // and update agent performance metrics
    
    console.log('Feedback recorded:', {
      interactionId,
      userId,
      rating,
      agentFeedback,
      comments
    });
  }
  
  public getRecentInteractions(limit: number = 10): any[] {
    console.log(`Getting recent interactions (limit: ${limit})`);
    
    // In a real implementation, this would retrieve recent interactions from a database
    const recentInteractions = [
      {
        id: 'interaction-1',
        timestamp: new Date(),
        message: 'What is the capital of France?',
        response: 'The capital of France is Paris.',
        userId: 'user-123'
      },
      {
        id: 'interaction-2',
        timestamp: new Date(Date.now() - 3600000),
        message: 'Explain the theory of relativity.',
        response: 'The theory of relativity...',
        userId: 'user-456'
      }
    ];
    
    return recentInteractions.slice(0, limit);
  }
  
  public getAgentPerformanceMetrics(agentId: string): Record<string, any> {
    console.log(`Getting performance metrics for agent ${agentId}`);
    
    // In a real implementation, this would retrieve agent performance metrics from a database
    return {
      agentId,
      successRate: 0.85,
      averageResponseTime: 500,
      interactions: 120
    };
  }
  
  public getAllAgentPerformanceMetrics(): Record<string, any>[] {
    console.log('Getting performance metrics for all agents');
    
    // In a real implementation, this would retrieve performance metrics for all agents from a database
    return [
      {
        agentId: 'agent-1',
        successRate: 0.85,
        averageResponseTime: 500,
        interactions: 120
      },
      {
        agentId: 'agent-2',
        successRate: 0.92,
        averageResponseTime: 420,
        interactions: 150
      }
    ];
  }
  
  public getUserTopInterests(userId: string, limit: number = 5): string[] {
    console.log(`Getting top interests for user ${userId} (limit: ${limit})`);
    
    // In a real implementation, this would analyze user interaction history
    // and identify top interests
    const interests = ['AI', 'Machine Learning', 'Data Science', 'Quantum Computing', 'Web Development'];
    return interests.slice(0, limit);
  }
}
