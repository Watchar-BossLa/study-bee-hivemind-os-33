
import { CouncilDecision } from '../../types/councils';
import { DeliberationManager } from '../core/DeliberationManager';

/**
 * Handles council deliberations in QuorumForge
 */
export class CouncilDeliberation {
  private deliberationManager: DeliberationManager;
  
  constructor(deliberationManager: DeliberationManager) {
    this.deliberationManager = deliberationManager;
  }
  
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
   * Get recent decisions
   */
  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.deliberationManager.getRecentDecisions(limit);
  }
}
