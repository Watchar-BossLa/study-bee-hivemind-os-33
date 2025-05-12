
import { SpecializedAgent } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { VotingService } from './deliberation/VotingService';
import { ConsensusService } from './deliberation/ConsensusService';
import { VoteHistoryStorage } from './deliberation/VoteHistoryStorage';
import { VoteIntegrityService } from './deliberation/VoteIntegrityService';
import { DeliberationProcessor } from './deliberation/DeliberationProcessor';
import { DecisionBuilder } from './deliberation/DecisionBuilder';
import { Plan as VotingPlan } from './deliberation/types/votingTypes';
import { Plan as CrewAIPlan } from './frameworks/CrewAIPlanner';

export interface DeliberationOptions {
  timeLimit?: number; // ms
  complexityOverride?: 'low' | 'medium' | 'high';
  consensusThreshold?: number; // 0-1
  boostAgentIds?: string[]; // IDs of agents to boost
  boostFactor?: number; // How much to boost (0-1)
  minRequiredVotes?: number;
  usePerformanceHistory?: boolean;
}

export class DeliberationService {
  private decisions: CouncilDecision[] = [];
  private votingService: VotingService;
  private consensusService: ConsensusService;
  private voteHistoryStorage: VoteHistoryStorage;
  private deliberationProcessor: DeliberationProcessor;
  private decisionBuilder: DecisionBuilder;
  
  constructor() {
    this.votingService = new VotingService();
    this.consensusService = new ConsensusService();
    this.voteHistoryStorage = new VoteHistoryStorage();
    this.deliberationProcessor = new DeliberationProcessor(this.votingService, this.consensusService);
    this.decisionBuilder = new DecisionBuilder();
  }

  public async deliberate(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, unknown>,
    options?: DeliberationOptions
  ): Promise<CouncilDecision> {
    console.log(`Starting deliberation on topic: ${topic}`);
    
    // Check if we have a cached decision for this topic/council
    const councilId = this.getCouncilId(council);
    const cachedDecision = this.voteHistoryStorage.getCachedDecision(topic, councilId);
    
    if (cachedDecision && !options?.timeLimit) {
      console.log(`Using cached decision for topic: ${topic}`);
      return cachedDecision;
    }
    
    const startTime = Date.now();
    
    // Process the deliberation
    const { votes, suggestion, confidence, suspiciousVotes } = 
      this.deliberationProcessor.processDeliberation(council, topic, context, options);
    
    // Create decision
    const decision = this.decisionBuilder.createDecision(
      topic,
      votes,
      suggestion || 'No consensus reached',
      confidence,
      suspiciousVotes
    );

    // Add to history and cache
    this.decisions.push(decision);
    this.voteHistoryStorage.addVoteToHistory(
      decision, 
      councilId, 
      this.generateTopicId(topic),
      Date.now() - startTime
    );
    
    return decision;
  }
  
  public async deliberateWithPlan(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, unknown>,
    plan: VotingPlan,
    options?: DeliberationOptions
  ): Promise<CouncilDecision> {
    console.log(`Deliberating with plan: ${plan.summary}`);
    
    const startTime = Date.now();
    
    // Convert plan to ensure it's compatible with CrewAIPlan
    const compatiblePlan: CrewAIPlan = {
      id: plan.id,
      title: plan.title,
      type: plan.type,
      summary: plan.summary,
      tasks: plan.tasks ? plan.tasks.map(task => ({
        id: task.taskId,
        description: task.description,
      })) : []
    };
    
    // Process the deliberation with plan
    const { votes, suggestion, confidence, suspiciousVotes } = 
      this.deliberationProcessor.processDeliberationWithPlan(council, topic, plan, options);
    
    // Create decision
    let decision = this.decisionBuilder.createDecision(
      topic,
      votes,
      suggestion || 'No consensus reached',
      confidence,
      suspiciousVotes
    );
    
    // Add plan metadata to the decision
    decision = this.decisionBuilder.addPlanMetadata(decision, compatiblePlan);

    // Add to history
    this.decisions.push(decision);
    
    const councilId = this.getCouncilId(council);
    this.voteHistoryStorage.addVoteToHistory(
      decision, 
      councilId, 
      this.generateTopicId(topic),
      Date.now() - startTime
    );
    
    return decision;
  }
  
  /**
   * Record user feedback on a consensus decision
   */
  public recordFeedback(
    decisionIndex: number, 
    rating: number, 
    comments?: string
  ): void {
    // In a real implementation, this would update agent performance metrics
    console.log(`Received feedback on decision ${decisionIndex}: ${rating}`);
  }

  public getRecentDecisions(limit: number = 10): CouncilDecision[] {
    return this.decisions.slice(-limit);
  }
  
  /**
   * Generate a unique ID for a council based on member IDs
   */
  private getCouncilId(council: SpecializedAgent[]): string {
    return council
      .map(agent => agent.id)
      .sort()
      .join('-');
  }
  
  /**
   * Generate a topic ID by normalizing the topic string
   */
  private generateTopicId(topic: string): string {
    return topic.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 32);
  }
}
