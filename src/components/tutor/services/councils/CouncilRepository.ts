
import { SpecializedAgent } from '../../types/agents';
import { allSpecializedAgents } from '../SpecializedAgents';

export class CouncilRepository {
  private councils: Map<string, SpecializedAgent[]> = new Map();
  
  constructor(agents: SpecializedAgent[] = allSpecializedAgents) {
    this.setupDefaultCouncils(agents);
  }

  private setupDefaultCouncils(agents: SpecializedAgent[]): void {
    this.councils.set('mathematics', agents.filter(a => 
      a.id === 'content-expert' || a.id === 'learning-strategist' || 
      a.id === 'assessment-expert' || a.id === 'math-specialist'
    ));
    
    this.councils.set('science', agents.filter(a => 
      a.id === 'content-expert' || a.id === 'engagement-specialist' || 
      a.id === 'assessment-expert' || a.id === 'science-specialist'
    ));
    
    this.councils.set('language', agents.filter(a => 
      a.id === 'content-expert' || a.id === 'learning-strategist' || 
      a.id === 'engagement-specialist' || a.id === 'humanities-specialist'
    ));
    
    this.councils.set('meta-learning', agents.filter(a =>
      a.id === 'metacognition-coach' || a.id === 'progress-analyst' || 
      a.id === 'learning-strategist'
    ));
    
    this.councils.set('collaborative', agents.filter(a =>
      a.id === 'collaboration-facilitator' || a.id === 'engagement-specialist' || 
      a.id === 'metacognition-coach'
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
}
