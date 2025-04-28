import { BaseAgent, SpecializedAgent, UserInteraction } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { LLMRouter } from './LLMRouter';
import { CouncilService } from './CouncilService';
import { DeliberationService } from './DeliberationService';
import { InteractionService } from './InteractionService';
import { AgentService } from './AgentService';

// Specialized learning agents
export const specializedAgents: SpecializedAgent[] = [
  {
    id: 'content-expert',
    name: 'ContentExpertGPT',
    role: 'Content Expert',
    capabilities: ['knowledge-validation', 'fact-checking', 'content-creation'],
    status: 'idle',
    domain: 'Subject Matter',
    expertise: ['curriculum-alignment', 'academic-standards', 'content-accuracy'],
    performance: { accuracy: 0.95, responseTime: 1200, userFeedback: 4.8 }
  },
  {
    id: 'learning-strategist',
    name: 'LearningStrategistGPT',
    role: 'Learning Strategist',
    capabilities: ['learning-path-design', 'difficulty-assessment', 'prerequisite-analysis'],
    status: 'idle',
    domain: 'Pedagogy',
    expertise: ['learning-theory', 'cognitive-load', 'scaffolding'],
    performance: { accuracy: 0.92, responseTime: 800, userFeedback: 4.7 }
  },
  {
    id: 'engagement-specialist',
    name: 'EngagementSpecialistGPT',
    role: 'Engagement Specialist',
    capabilities: ['motivation-analysis', 'engagement-tactics', 'feedback-optimization'],
    status: 'idle',
    domain: 'User Experience',
    expertise: ['gamification', 'reinforcement', 'flow-state'],
    performance: { accuracy: 0.89, responseTime: 600, userFeedback: 4.9 }
  },
  {
    id: 'assessment-expert',
    name: 'AssessmentExpertGPT',
    role: 'Assessment Expert',
    capabilities: ['question-generation', 'answer-validation', 'difficulty-calibration'],
    status: 'idle',
    domain: 'Evaluation',
    expertise: ['bloom-taxonomy', 'assessment-design', 'knowledge-testing'],
    performance: { accuracy: 0.94, responseTime: 900, userFeedback: 4.6 }
  }
];

export class QuorumForge {
  private agentService: AgentService;
  private councilService: CouncilService;
  private deliberationService: DeliberationService;
  private interactionService: InteractionService;
  
  constructor(
    agents: SpecializedAgent[] = specializedAgents, 
    router: LLMRouter = new LLMRouter()
  ) {
    this.agentService = new AgentService(agents);
    this.councilService = new CouncilService(agents);
    this.deliberationService = new DeliberationService();
    this.interactionService = new InteractionService(router);
  }

  public async deliberate(
    councilId: string, 
    topic: string, 
    context: Record<string, any>,
    maxTurns: number = 3, 
    consensusThreshold: number = 0.8
  ): Promise<CouncilDecision> {
    const council = this.councilService.getCouncil(councilId);
    if (!council) {
      throw new Error(`Council "${councilId}" does not exist`);
    }
    
    return this.deliberationService.deliberate(
      council,
      topic,
      context,
      maxTurns,
      consensusThreshold
    );
  }

  public async processInteraction(
    message: string,
    userId: string,
    context: Record<string, any>
  ): Promise<UserInteraction> {
    const councilId = this.councilService.determineCouncilForMessage(message);
    const council = this.councilService.getCouncil(councilId);
    
    if (!council) {
      throw new Error('Could not find appropriate council for message');
    }

    const interaction: UserInteraction = {
      id: `int-${Date.now()}`,
      userId,
      timestamp: new Date(),
      message,
      context,
      agentResponses: []
    };

    for (const agent of council) {
      const response = await this.interactionService.processAgentResponse(
        agent,
        message,
        context
      );
      interaction.agentResponses.push(response);
    }

    this.interactionService.addInteraction(interaction);
    return interaction;
  }

  public getAgents(): SpecializedAgent[] {
    return this.agentService.getAgents();
  }

  public getCouncils(): Map<string, SpecializedAgent[]> {
    return this.councilService.getAllCouncils();
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.deliberationService.getRecentDecisions(limit);
  }

  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactionService.getRecentInteractions(limit);
  }
}

export const quorumForge = new QuorumForge();
