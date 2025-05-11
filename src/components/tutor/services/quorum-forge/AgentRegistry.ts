
import { SpecializedAgent } from '../../types/agents';
import { AgentService } from '../AgentService';
import { CouncilService } from '../CouncilService';

/**
 * Manages the agent registry in QuorumForge
 */
export class AgentRegistry {
  private agentService: AgentService;
  private councilService: CouncilService;
  
  constructor(agentService: AgentService, councilService: CouncilService) {
    this.agentService = agentService;
    this.councilService = councilService;
  }
  
  /**
   * Get all agents
   */
  public getAgents(): SpecializedAgent[] {
    return this.agentService.getAgents();
  }

  /**
   * Get all councils
   */
  public getCouncils(): Map<string, SpecializedAgent[]> {
    return this.councilService.getAllCouncils();
  }
  
  /**
   * Get agent by ID
   */
  public getAgentById(agentId: string): SpecializedAgent | undefined {
    return this.agentService.getAgentById(agentId);
  }
  
  /**
   * Get council by ID
   */
  public getCouncilById(councilId: string): SpecializedAgent[] | undefined {
    return this.councilService.getCouncil(councilId);
  }
}
