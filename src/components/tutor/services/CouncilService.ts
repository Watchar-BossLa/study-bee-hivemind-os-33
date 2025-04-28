
import { Council } from '../types/councils';
import { SpecializedAgent } from '../types/agents';

export class CouncilService {
  private councils: Map<string, SpecializedAgent[]> = new Map();

  constructor(agents: SpecializedAgent[]) {
    this.setupDefaultCouncils(agents);
  }

  private setupDefaultCouncils(agents: SpecializedAgent[]): void {
    this.councils.set('mathematics', agents.filter(a => 
      a.id === 'content-expert' || a.id === 'learning-strategist' || a.id === 'assessment-expert'
    ));
    
    this.councils.set('science', agents.filter(a => 
      a.id === 'content-expert' || a.id === 'engagement-specialist' || a.id === 'assessment-expert'
    ));
    
    this.councils.set('language', agents.filter(a => 
      a.id === 'content-expert' || a.id === 'learning-strategist' || a.id === 'engagement-specialist'
    ));
    
    this.councils.set('meta', agents);
  }

  public createCouncil(councilId: string, agentIds: string[], agents: SpecializedAgent[]): void {
    const councilAgents = agents.filter(agent => agentIds.includes(agent.id));
    if (councilAgents.length === 0) {
      throw new Error('Cannot create an empty council');
    }
    this.councils.set(councilId, councilAgents);
  }

  public getCouncil(councilId: string): SpecializedAgent[] | undefined {
    return this.councils.get(councilId);
  }

  public getAllCouncils(): Map<string, SpecializedAgent[]> {
    return this.councils;
  }

  public determineCouncilForMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('math') || lowerMessage.includes('equation') || 
        lowerMessage.includes('calculus') || lowerMessage.includes('algebra')) {
      return 'mathematics';
    } else if (lowerMessage.includes('science') || lowerMessage.includes('biology') || 
               lowerMessage.includes('chemistry') || lowerMessage.includes('physics')) {
      return 'science';
    } else if (lowerMessage.includes('english') || lowerMessage.includes('literature') || 
               lowerMessage.includes('writing') || lowerMessage.includes('grammar')) {
      return 'language';
    }
    return 'meta';
  }
}
