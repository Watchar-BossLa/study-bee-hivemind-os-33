
import { CouncilDecision, CouncilVote } from '../../types/councils';
import { Plan as CrewAIPlan } from '../frameworks/CrewAIPlanner';
import { Plan as VotingPlan } from './types/votingTypes';

export class DecisionBuilder {
  /**
   * Creates a council decision object
   */
  public createDecision(
    topic: string,
    votes: CouncilVote[],
    consensus: string,
    confidenceScore: number,
    suspiciousVotes: CouncilVote[] = []
  ): CouncilDecision {
    // Create security analysis if suspicious votes were detected
    const securityAnalysis = suspiciousVotes.length > 0 ? {
      riskLevel: suspiciousVotes.length / votes.length,
      recommendations: ["Review suspicious votes", "Consider re-running deliberation"]
    } : undefined;
    
    return {
      topic,
      votes,
      consensus,
      confidenceScore,
      timestamp: new Date(),
      securityAnalysis
    };
  }
  
  /**
   * Adds plan metadata to a decision
   */
  public addPlanMetadata(
    decision: CouncilDecision,
    plan: CrewAIPlan
  ): CouncilDecision {
    return {
      ...decision,
      plan: {
        id: plan.id,
        title: plan.title,
        taskCount: plan.tasks.length,
        memberCount: plan.members?.length || 0
      }
    };
  }
  
  /**
   * Creates a security analysis for decisions with detected issues
   */
  public createSecurityAnalysis(
    votes: CouncilVote[],
    suspiciousVotes: CouncilVote[],
    threadId?: string
  ) {
    if (suspiciousVotes.length === 0) {
      return undefined;
    }
    
    return {
      riskLevel: suspiciousVotes.length / votes.length,
      recommendations: [
        "Review suspicious votes",
        "Consider re-running deliberation",
        "Analyze voting patterns for manipulation"
      ],
      threadId
    };
  }
}
