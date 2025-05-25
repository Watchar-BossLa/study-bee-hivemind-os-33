
import { SpecializedAgent } from '../../types/agents';
import { CouncilRepository } from './CouncilRepository';
import { CouncilSelector } from './CouncilSelector';

export class CouncilManagementService {
  private repository: CouncilRepository;
  private selector: CouncilSelector;

  constructor(agents: SpecializedAgent[] = []) {
    this.repository = new CouncilRepository(agents);
    this.selector = new CouncilSelector();
  }

  public getCouncil(id: string): SpecializedAgent[] | undefined {
    return this.repository.getCouncil(id);
  }
  
  public getAllCouncils(): Map<string, SpecializedAgent[]> {
    return this.repository.getAllCouncils();
  }
  
  public createCouncil(id: string, agents: SpecializedAgent[]): boolean {
    try {
      this.repository.createCouncil(id, agents.map(a => a.id), agents);
      return true;
    } catch (error) {
      console.error('Failed to create council:', error);
      return false;
    }
  }
  
  public updateCouncil(id: string, agents: SpecializedAgent[]): boolean {
    const existing = this.repository.getCouncil(id);
    if (!existing) {
      return false;
    }
    
    try {
      this.repository.createCouncil(id, agents.map(a => a.id), agents);
      return true;
    } catch (error) {
      console.error('Failed to update council:', error);
      return false;
    }
  }
  
  public deleteCouncil(id: string): boolean {
    const councils = this.repository.getAllCouncils();
    return councils.delete(id);
  }
  
  public determineCouncilForMessage(message: string): string {
    const councilIds = Array.from(this.repository.getAllCouncils().keys());
    return this.selector.selectCouncilForMessage(message, councilIds);
  }

  public createDefaultCouncils(agents: SpecializedAgent[]): void {
    const tutorAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('teaching') || e.includes('education'))
    );
    
    const securityAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('security'))
    );
    
    const reasoningAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('reasoning') || e.includes('logic'))
    );
    
    const codeAgents = agents.filter(agent => 
      agent.expertise.some(e => e.includes('code') || e.includes('programming'))
    );
    
    if (tutorAgents.length >= 3) {
      this.createCouncil('tutor', tutorAgents.slice(0, 5));
    }
    
    if (securityAgents.length >= 3) {
      this.createCouncil('security', securityAgents.slice(0, 5));
    }
    
    if (reasoningAgents.length >= 3) {
      this.createCouncil('reasoning', reasoningAgents.slice(0, 5));
    }
    
    if (codeAgents.length >= 3) {
      this.createCouncil('code', codeAgents.slice(0, 5));
    }
    
    const generalAgents = this.selectDiverseAgents(agents, 5);
    if (generalAgents.length >= 3) {
      this.createCouncil('general', generalAgents);
    }
  }

  private selectDiverseAgents(agents: SpecializedAgent[], count: number): SpecializedAgent[] {
    const selected: SpecializedAgent[] = [];
    const expertiseCovered = new Set<string>();
    
    const sortedAgents = [...agents].sort((a, b) => b.expertise.length - a.expertise.length);
    
    for (const agent of sortedAgents) {
      if (selected.length >= count) break;
      
      const newExpertise = agent.expertise.some(e => !expertiseCovered.has(e));
      if (newExpertise || selected.length < 3) {
        selected.push(agent);
        agent.expertise.forEach(e => expertiseCovered.add(e));
      }
    }
    
    return selected;
  }
}
