
import { Council } from '../types/councils';
import { SpecializedAgent } from '../types/agents';
import { allSpecializedAgents } from './SpecializedAgents';
import { CouncilRepository } from './councils/CouncilRepository';
import { DynamicCouncilManager } from './councils/DynamicCouncilManager'; 
import { CouncilSelector } from './councils/CouncilSelector';
import { OpenAISwarmWrapper } from './frameworks/OpenAISwarmWrapper';

export class CouncilService {
  private councilRepository: CouncilRepository;
  private dynamicCouncilManager: DynamicCouncilManager;
  private councilSelector: CouncilSelector;
  private swarmWrapper: OpenAISwarmWrapper;

  constructor(agents: SpecializedAgent[] = allSpecializedAgents) {
    this.councilRepository = new CouncilRepository(agents);
    this.dynamicCouncilManager = new DynamicCouncilManager();
    this.councilSelector = new CouncilSelector(this.dynamicCouncilManager);
    this.swarmWrapper = new OpenAISwarmWrapper();
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
  
  public async executeParallelTasks(
    council: SpecializedAgent[],
    tasks: string[],
    context: Record<string, any>
  ): Promise<string[]> {
    if (council.length > 4 && tasks.length > 3) {
      console.log('Using OpenAI Swarm for parallel task execution');
      return this.swarmWrapper.runSwarm(tasks);
    } else {
      // Sequential execution simulation
      return Promise.all(tasks.map(async (task) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return `Sequential result for: ${task}`;
      }));
    }
  }
}
