
import { SpecializedAgent } from '../types/agents';
import { CouncilDecision } from '../types/councils';
import { VotingService, VotingOptions } from './deliberation/VotingService';
import { ConsensusService, ConsensusOptions } from './deliberation/ConsensusService';
import { Plan } from './frameworks/CrewAIPlanner';
import { VoteHistoryStorage } from './deliberation/VoteHistoryStorage';
import { VoteIntegrityService } from './deliberation/VoteIntegrityService';

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
  
  constructor() {
    this.votingService = new VotingService();
    this.consensusService = new ConsensusService();
    this.voteHistoryStorage = new VoteHistoryStorage();
  }

  public async deliberate(
    council: SpecializedAgent[],
    topic: string,
    context: Record<string, any>,
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
    
    // Convert deliberation options to voting options
    const votingOptions: VotingOptions = {
      timeLimit: options?.timeLimit,
      complexityOverride: options?.complexityOverride,
      boostAgentIds: options?.boostAgentIds,
      boostFactor: options?.boostFactor,
      minRequiredVotes: options?.minRequiredVotes,
      usePerformanceHistory: options?.usePerformanceHistory
    };
    
    // Get votes from agents
    const votes = this.votingService.collectVotes(council, topic, votingOptions);
    const suggestionGroups = this.votingService.groupVotesBySuggestion(votes);
    
    // Check for suspicious votes
    const suspiciousVotes = this.votingService.detectSuspiciousVotes(votes);
    if (suspiciousVotes.length > 0) {
      console.warn(`Detected ${suspiciousVotes.length} suspicious votes during deliberation`);
    }
    
    // Convert deliberation options to consensus options
    const consensusOptions: ConsensusOptions = {
      baseThreshold: options?.consensusThreshold || 0.7,
      minRequiredVotes: options?.minRequiredVotes,
      timeoutMs: options?.timeLimit,
      topicComplexity: options?.complexityOverride
    };
    
    // Calculate consensus
    const { suggestion, confidence } = this.consensusService.calculateConsensus(
      votes,
      suggestionGroups,
      consensusOptions
    );
    
    // Create security analysis if suspicious votes were detected
    const securityAnalysis = suspiciousVotes.length > 0 ? {
      riskLevel: suspiciousVotes.length / votes.length,
      recommendations: ["Review suspicious votes", "Consider re-running deliberation"]
    } : undefined;
    
    // Create decision
    const decision = this.consensusService.createDecision(
      topic,
      votes,
      suggestion,
      confidence,
      securityAnalysis
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
    context: Record<string, any>,
    plan: Plan,
    options?: DeliberationOptions
  ): Promise<CouncilDecision> {
    console.log(`Deliberating with CrewAI plan: ${plan.title}`);
    
    const startTime = Date.now();
    
    // Convert deliberation options to voting options
    const votingOptions: VotingOptions = {
      timeLimit: options?.timeLimit,
      complexityOverride: options?.complexityOverride || 'high', // Plans are typically complex
      boostAgentIds: options?.boostAgentIds,
      boostFactor: options?.boostFactor,
      minRequiredVotes: options?.minRequiredVotes,
      usePerformanceHistory: options?.usePerformanceHistory
    };
    
    // Use the plan tasks to guide voting process
    const enhancedVotes = this.votingService.collectVotesWithPlan(
      council, 
      topic, 
      plan,
      votingOptions
    );
    
    const suggestionGroups = this.votingService.groupVotesBySuggestion(enhancedVotes);
    
    // Check for suspicious votes
    const suspiciousVotes = this.votingService.detectSuspiciousVotes(enhancedVotes);
    
    // Convert deliberation options to consensus options
    const consensusOptions: ConsensusOptions = {
      baseThreshold: options?.consensusThreshold || 0.65, // Lower threshold for plan-based decisions
      minRequiredVotes: options?.minRequiredVotes,
      timeoutMs: options?.timeLimit,
      topicComplexity: 'high' // Plans are considered complex
    };
    
    const { suggestion, confidence } = this.consensusService.calculateConsensus(
      enhancedVotes,
      suggestionGroups,
      consensusOptions
    );
    
    // Create security analysis if suspicious votes were detected
    const securityAnalysis = suspiciousVotes.length > 0 ? {
      riskLevel: suspiciousVotes.length / enhancedVotes.length,
      recommendations: ["Review suspicious votes", "Consider re-running deliberation with plan"]
    } : undefined;
    
    // Create decision
    const decision = this.consensusService.createDecision(
      topic,
      enhancedVotes,
      suggestion,
      confidence,
      securityAnalysis
    );
    
    // Add plan metadata to the decision
    decision.plan = {
      id: plan.id,
      title: plan.title,
      taskCount: plan.tasks.length,
      memberCount: plan.members.length
    };

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
