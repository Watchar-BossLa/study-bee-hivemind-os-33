
import { SpecializedAgent } from '../../types/agents';
import { allSpecializedAgents, getAgentsForTopic } from '../SpecializedAgents';

export interface DynamicCouncilData {
  agents: SpecializedAgent[];
  lastUsed: Date;
  performanceRating?: number;
}

export class DynamicCouncilManager {
  private dynamicCouncils: Map<string, DynamicCouncilData> = new Map();

  constructor() {
    // Initialize with empty map
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
  
  public getDynamicCouncil(councilId: string): SpecializedAgent[] | undefined {
    const councilData = this.dynamicCouncils.get(councilId);
    return councilData?.agents;
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
  
  public getAllDynamicCouncils(): Map<string, DynamicCouncilData> {
    return new Map(this.dynamicCouncils);
  }
}
