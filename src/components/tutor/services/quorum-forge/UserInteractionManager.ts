
import { UserInteraction } from '../../types/agents';
import { InteractionManager } from '../core/InteractionManager';

/**
 * Manages user interactions in QuorumForge
 */
export class UserInteractionManager {
  private interactionManager: InteractionManager;
  
  constructor(interactionManager: InteractionManager) {
    this.interactionManager = interactionManager;
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
  
  /**
   * Get recent interactions
   */
  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactionManager.getRecentInteractions(limit);
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
  ): void {
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
  public getUserTopInterests(userId: string, limit: number = 5): string[] {
    return this.interactionManager.getUserTopInterests(userId, limit);
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
}
