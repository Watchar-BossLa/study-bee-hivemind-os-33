
import { Council } from '../types/councils';
import { SpecializedAgent } from '../types/agents';
import { allSpecializedAgents } from './SpecializedAgents';
import { CouncilRepository } from './councils/CouncilRepository';
import { DynamicCouncilManager } from './councils/DynamicCouncilManager'; 
import { CouncilSelector } from './councils/CouncilSelector';

export class CouncilService {
  private councilRepository: CouncilRepository;
  private dynamicCouncilManager: DynamicCouncilManager;
  private councilSelector: CouncilSelector;

  constructor(agents: SpecializedAgent[] = allSpecializedAgents) {
    this.councilRepository = new CouncilRepository(agents);
    this.dynamicCouncilManager = new DynamicCouncilManager();
    this.councilSelector = new CouncilSelector(this.dynamicCouncilManager);
  }

  public createCouncil(councilId: string, agentIds: string[], agents: SpecializedAgent[]): void {
    this.councilRepository.createCouncil(councilId, agentIds, agents);
  }

  public getCouncil(councilId: string): SpecializedAgent[] | undefined {
    return this.councilRepository.getCouncil(councilId) || 
           this.dynamicCouncilManager.getDynamicCouncil(councilId);
  }

  public getAllCouncils(): Map<string, SpecializedAgent[]> {
    return this.councilRepository.getAllCouncils();
  }

  public determineCouncilForMessage(message: string): string {
    return this.councilSelector.determineCouncilForMessage(message);
  }
  
  public createDynamicCouncil(message: string): string {
    return this.dynamicCouncilManager.createDynamicCouncil(message);
  }
  
  public updateCouncilPerformance(councilId: string, rating: number): void {
    this.dynamicCouncilManager.updateCouncilPerformance(councilId, rating);
  }
  
  public getBestCouncilForSimilarQuery(query: string): string | undefined {
    return this.dynamicCouncilManager.getBestCouncilForSimilarQuery(query);
  }
}
