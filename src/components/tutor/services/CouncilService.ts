import { Council } from '../types/councils';
import { SpecializedAgent } from '../types/agents';
import { allSpecializedAgents, getAgentsByDomain, getAgentsForTopic } from './SpecializedAgents';

export class CouncilService {
  private councils: Map<string, SpecializedAgent[]> = new Map();
  private dynamicCouncils: Map<string, {
    agents: SpecializedAgent[],
    lastUsed: Date,
    performanceRating?: number
  }> = new Map();

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
    return this.councils.get(councilId) || this.dynamicCouncils.get(councilId)?.agents;
  }

  public getAllCouncils(): Map<string, SpecializedAgent[]> {
    return this.councils;
  }

  public determineCouncilForMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('math') || lowerMessage.includes('equation') || 
        lowerMessage.includes('calculus') || lowerMessage.includes('algebra') ||
        lowerMessage.includes('geometry') || lowerMessage.includes('statistical')) {
      return 'mathematics';
    } else if (lowerMessage.includes('science') || lowerMessage.includes('biology') || 
               lowerMessage.includes('chemistry') || lowerMessage.includes('physics') ||
               lowerMessage.includes('experiment') || lowerMessage.includes('scientific')) {
      return 'science';
    } else if (lowerMessage.includes('english') || lowerMessage.includes('literature') || 
               lowerMessage.includes('writing') || lowerMessage.includes('grammar') ||
               lowerMessage.includes('history') || lowerMessage.includes('philosophy')) {
      return 'language';
    } else if (lowerMessage.includes('how to learn') || lowerMessage.includes('study technique') || 
               lowerMessage.includes('memory') || lowerMessage.includes('concentration') ||
               lowerMessage.includes('focus') || lowerMessage.includes('metacognition')) {
      return 'meta-learning';
    } else if (lowerMessage.includes('group') || lowerMessage.includes('together') || 
               lowerMessage.includes('team') || lowerMessage.includes('collaborate') ||
               lowerMessage.includes('peer') || lowerMessage.includes('social learning')) {
      return 'collaborative';
    }
    
    return this.createDynamicCouncil(message);
  }
  
  public createDynamicCouncil(message: string): string {
    const potentialTopics = this.extractTopicsFromMessage(message);
    const councilId = `dynamic-${Date.now()}`;
    let selectedAgents: SpecializedAgent[] = [];
    
    if (potentialTopics.length > 0) {
      const topicAgents = getAgentsForTopic(potentialTopics.join(' '), 2);
      const learningStrategist = allSpecializedAgents.find(a => a.id === 'learning-strategist');
      const engagementSpecialist = allSpecializedAgents.find(a => a.id === 'engagement-specialist');
      
      selectedAgents = [
        ...topicAgents,
        ...(learningStrategist ? [learningStrategist] : []),
        ...(engagementSpecialist ? [engagementSpecialist] : [])
      ];
      
      selectedAgents = Array.from(new Map(selectedAgents.map(agent => [agent.id, agent])).values());
      
      if (selectedAgents.length > 5) {
        selectedAgents = selectedAgents.slice(0, 5);
      }
    } else {
      selectedAgents = [
        allSpecializedAgents.find(a => a.id === 'content-expert')!,
        allSpecializedAgents.find(a => a.id === 'learning-strategist')!,
        allSpecializedAgents.find(a => a.id === 'metacognition-coach')!
      ].filter(Boolean);
    }
    
    this.dynamicCouncils.set(councilId, {
      agents: selectedAgents,
      lastUsed: new Date()
    });
    
    this.cleanupDynamicCouncils();
    
    return councilId;
  }
  
  private extractTopicsFromMessage(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    const potentialTopics = [
      'Mitochondria', 'ATP', 'Cellular Respiration', 'Krebs Cycle',
      'Electron Transport', 'Glycolysis', 'Cell Biology', 'DNA',
      'RNA', 'Protein Synthesis', 'Genetics', 'Evolution',
      'Natural Selection', 'Algebra', 'Calculus', 'Statistics',
      'Geometry', 'Probability', 'Physics', 'Chemistry',
      'Literature', 'Grammar', 'History', 'Philosophy',
      'Programming', 'Computer Science', 'Art', 'Music'
    ];
    
    return potentialTopics.filter(topic => 
      lowerMessage.includes(topic.toLowerCase())
    );
  }
  
  private cleanupDynamicCouncils(): void {
    if (this.dynamicCouncils.size <= 10) return;
    
    const councilEntries = Array.from(this.dynamicCouncils.entries());
    councilEntries.sort((a, b) => b[1].lastUsed.getTime() - a[1].lastUsed.getTime());
    
    this.dynamicCouncils = new Map(councilEntries.slice(0, 10));
  }
  
  public updateCouncilPerformance(councilId: string, rating: number): void {
    const dynamicCouncil = this.dynamicCouncils.get(councilId);
    if (dynamicCouncil) {
      if (dynamicCouncil.performanceRating !== undefined) {
        dynamicCouncil.performanceRating = (dynamicCouncil.performanceRating + rating) / 2;
      } else {
        dynamicCouncil.performanceRating = rating;
      }
      
      dynamicCouncil.lastUsed = new Date();
    }
  }
  
  public getBestCouncilForSimilarQuery(query: string): string | undefined {
    if (this.dynamicCouncils.size === 0) return undefined;
    
    const queryTopics = this.extractTopicsFromMessage(query);
    if (queryTopics.length === 0) return undefined;
    
    const relevantCouncils: Array<{id: string, relevanceScore: number, performanceRating?: number}> = [];
    
    this.dynamicCouncils.forEach((councilData, councilId) => {
      if (councilData.performanceRating === undefined) return;
      
      let relevanceScore = 0;
      councilData.agents.forEach(agent => {
        queryTopics.forEach(topic => {
          const hasExpertise = agent.expertise.some(exp => 
            exp.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(exp.toLowerCase())
          );
          
          if (hasExpertise) relevanceScore += 1;
        });
      });
      
      if (relevanceScore > 0) {
        relevantCouncils.push({
          id: councilId,
          relevanceScore,
          performanceRating: councilData.performanceRating
        });
      }
    });
    
    relevantCouncils.sort((a, b) => {
      const scoreA = a.relevanceScore * (a.performanceRating || 0);
      const scoreB = b.relevanceScore * (b.performanceRating || 0);
      return scoreB - scoreA;
    });
    
    return relevantCouncils.length > 0 ? relevantCouncils[0].id : undefined;
  }
}
