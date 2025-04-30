
import { CouncilService } from '../CouncilService';
import { DeliberationService } from '../DeliberationService';
import { FrameworkManager } from './FrameworkManager';
import { CouncilDecision } from '../../types/councils';

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
    const council = this.councilService.getCouncil(councilId);
    if (!council) {
      throw new Error(`Council "${councilId}" does not exist`);
    }
    
    // Use PydanticValidator to validate input context
    const validatedContext = this.frameworkManager.getPydanticValidator().validateContext(context);
    
    // Enhanced deliberation process with CrewAI for complex topics
    if (this.shouldUseCrewAI(topic, validatedContext)) {
      const crewPlan = await this.frameworkManager.getCrewAIPlanner().createPlan(topic, council, validatedContext);
      return this.deliberationService.deliberateWithPlan(
        council,
        topic,
        validatedContext,
        crewPlan,
        maxTurns,
        consensusThreshold
      );
    }
    
    return this.deliberationService.deliberate(
      council,
      topic,
      validatedContext,
      maxTurns,
      consensusThreshold
    );
  }

  private shouldUseCrewAI(topic: string, context: Record<string, any>): boolean {
    // Determine if the topic is complex enough to warrant CrewAI planning
    const topicComplexity = this.calculateTopicComplexity(topic);
    return topicComplexity > 0.7 || context.useCrewAI === true;
  }

  private calculateTopicComplexity(topic: string): number {
    // Simple heuristic for topic complexity
    const complexityWords = [
      'advanced', 'complex', 'detailed', 'comprehensive', 
      'intricate', 'sophisticated', 'multifaceted'
    ];
    
    let complexity = 0.4; // Base complexity
    
    // Increase complexity score based on matching words
    complexityWords.forEach(word => {
      if (topic.toLowerCase().includes(word)) {
        complexity += 0.1;
      }
    });
    
    // Adjust based on topic length (longer topics tend to be more complex)
    complexity += Math.min(0.2, topic.length / 500);
    
    return Math.min(1.0, complexity);
  }
  
  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.deliberationService.getRecentDecisions(limit);
  }
}
