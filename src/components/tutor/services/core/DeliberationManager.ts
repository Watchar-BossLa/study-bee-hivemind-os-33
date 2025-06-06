
import { SpecializedAgent, Council } from '../../types/agents';
import { CouncilDecision } from '../../types/councils'; 
import { DeliberationService, DeliberationOptions } from '../DeliberationService';
import { CouncilService } from '../CouncilService';
import { FrameworkManager } from './FrameworkManager';

/**
 * Manages deliberation process across multiple agents and councils
 */
export class DeliberationManager {
  private deliberationService: DeliberationService;
  private councilService: CouncilService;
  private frameworkManager: FrameworkManager;

  constructor(
    deliberationService: DeliberationService,
    councilService: CouncilService,
    frameworkManager: FrameworkManager
  ) {
    this.deliberationService = deliberationService;
    this.councilService = councilService;
    this.frameworkManager = frameworkManager;
  }

  public async deliberate(
    councilId: string, 
    topic: string, 
    context: Record<string, any>,
    maxTurns: number = 3, 
    consensusThreshold: number = 0.8
  ): Promise<CouncilDecision> {
    const councilAgents = this.councilService.getCouncil(councilId);
    
    if (!councilAgents) {
      throw new Error(`Council with ID ${councilId} not found`);
    }
    
    // Create a Council object from the agents array
    const council: Council = {
      id: councilId,
      name: `Council-${councilId}`,
      topic: topic,
      agents: councilAgents,
      status: 'active',
      createdAt: new Date()
    };
    
    const options: DeliberationOptions = {
      consensusThreshold,
      timeLimit: maxTurns * 30000 // 30 seconds per turn
    };
    
    return await this.deliberationService.deliberate(
      council, 
      topic, 
      context, 
      options
    );
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.deliberationService.getRecentDecisions(limit);
  }
}
