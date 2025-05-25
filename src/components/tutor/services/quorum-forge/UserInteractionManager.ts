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
    const response = await this.interactionManager.processUserInteraction(message, userId, context);
    
    // Convert the response to UserInteraction format
    const userInteraction: UserInteraction = {
      id: Math.random().toString(36).substring(7),
      userId,
      agentId: 'combined',
      message,
      response: response.response,
      timestamp: new Date(),
      context: {
        ...context,
        agentContributions: response.agentContributions,
        metadata: response.metadata
      }
    };
    
    return userInteraction;
  }
  
  /**
   * Get recent interactions - implemented locally since InteractionManager doesn't have this
   */
  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    // Fallback implementation since InteractionManager doesn't have this method
    console.log(`Getting ${limit} recent interactions`);
    return [];
  }
  
  /**
   * Record feedback - implemented locally since InteractionManager doesn't have this
   */
  public recordFeedback(
    interactionId: string, 
    userId: string, 
    rating: number, 
    agentFeedback?: Record<string, number>,
    comments?: string
  ): void {
    // Fallback implementation since InteractionManager doesn't have this method
    console.log(`Recording feedback for interaction ${interactionId}:`, {
      userId,
      rating,
      agentFeedback,
      comments
    });
  }
  
  /**
   * Get user top interests - implemented locally since InteractionManager doesn't have this
   */
  public getUserTopInterests(userId: string, limit: number = 5): string[] {
    // Fallback implementation since InteractionManager doesn't have this method
    console.log(`Getting top ${limit} interests for user ${userId}`);
    return [];
  }
  
  /**
   * Get agent performance metrics - implemented locally since InteractionManager doesn't have this
   */
  public getAgentPerformanceMetrics(agentId: string) {
    // Fallback implementation since InteractionManager doesn't have this method
    console.log(`Getting performance metrics for agent ${agentId}`);
    return null;
  }
  
  /**
   * Get all agent performance metrics - implemented locally since InteractionManager doesn't have this
   */
  public getAllAgentPerformanceMetrics() {
    // Fallback implementation since InteractionManager doesn't have this method
    console.log('Getting all agent performance metrics');
    return new Map();
  }
}
