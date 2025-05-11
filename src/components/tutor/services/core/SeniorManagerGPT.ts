
import { SpecializedAgent } from '../../types/agents';
import { Plan } from '../frameworks/CrewAIPlanner';
import { MCPCore, TaskPriority } from './MCPCore';
import { CouncilService } from '../CouncilService';

export interface PlanReviewResult {
  approved: boolean;
  score: number;
  feedback: string;
  suggestedRevisions?: string[];
  estimatedCost?: number;
  estimatedTime?: number;
  alternativePlan?: Partial<Plan>;
}

export interface ResourceAllocationPlan {
  agentAssignments: Map<string, string[]>; // agent ID -> task IDs
  councilAssignments: Map<string, string[]>; // council ID -> task IDs
  priority: Record<string, TaskPriority>; // task ID -> priority
  estimatedCompletion: Date;
}

/**
 * SeniorManagerGPT - Executive decision maker for agent orchestration
 * Implements the RL-based plan selector as defined in QuorumForge OS spec
 */
export class SeniorManagerGPT {
  private mcpCore: MCPCore;
  private councilService: CouncilService;
  private decisionHistory: Array<{plan: Plan, result: PlanReviewResult}> = [];
  private budgetThresholds: Record<string, number> = {
    low: 0.05,    // $0.05 threshold
    medium: 0.25, // $0.25 threshold
    high: 1.0     // $1.00 threshold
  };
  
  constructor(mcpCore: MCPCore, councilService: CouncilService) {
    this.mcpCore = mcpCore;
    this.councilService = councilService;
    console.log('SeniorManagerGPT initialized');
  }
  
  /**
   * Review a plan created by a council or agent
   * @param plan The plan to review
   * @param context Additional context for the review
   * @returns Decision about the plan
   */
  public async reviewPlan(plan: Plan, context: Record<string, any> = {}): Promise<PlanReviewResult> {
    console.log(`SeniorManagerGPT reviewing plan: ${plan.title}`);
    
    // Perform cost-benefit analysis
    const estimatedCost = this.estimatePlanCost(plan);
    const estimatedValue = this.estimatePlanValue(plan, context);
    const costEffectiveness = estimatedValue / (estimatedCost || 0.01);
    
    // Check against budget thresholds
    const budgetLevel = context.budgetLevel || 'medium';
    const threshold = this.budgetThresholds[budgetLevel] || this.budgetThresholds.medium;
    
    // Simulate RL-based decision making
    const rlScore = this.calculateRLScore(plan, context);
    const approved = rlScore > 0.7 && estimatedCost <= threshold;
    
    const result: PlanReviewResult = {
      approved,
      score: rlScore,
      feedback: approved 
        ? `Plan approved with score ${rlScore.toFixed(2)}, estimated cost $${estimatedCost.toFixed(2)}` 
        : `Plan rejected with score ${rlScore.toFixed(2)}, estimated cost $${estimatedCost.toFixed(2)} exceeds threshold of $${threshold}`,
      estimatedCost,
      estimatedTime: this.estimatePlanTime(plan)
    };
    
    // If not approved, generate suggested revisions
    if (!approved) {
      result.suggestedRevisions = this.generateRevisions(plan, context);
      result.alternativePlan = this.suggestAlternativePlan(plan, context);
    }
    
    // Record decision for reinforcement learning
    this.decisionHistory.push({ plan, result });
    
    return result;
  }
  
  /**
   * Create a resource allocation plan for executing a plan
   * @param plan The approved plan
   * @returns Resource allocation plan
   */
  public createResourceAllocationPlan(plan: Plan): ResourceAllocationPlan {
    console.log(`Creating resource allocation for plan: ${plan.title}`);
    
    const agentAssignments = new Map<string, string[]>();
    const councilAssignments = new Map<string, string[]>();
    const priority: Record<string, TaskPriority> = {};
    
    // Simulate resource allocation based on task types and available agents
    // In a real implementation, this would use agent capabilities and workload balancing
    
    const estimatedCompletionTime = new Date();
    estimatedCompletionTime.setMinutes(estimatedCompletionTime.getMinutes() + this.estimatePlanTime(plan));
    
    return {
      agentAssignments,
      councilAssignments,
      priority,
      estimatedCompletion: estimatedCompletionTime
    };
  }
  
  /**
   * Handle an unexpected event during plan execution
   * @param event The event that occurred
   * @param currentPlan The plan that was being executed
   * @returns Updated resource allocation if needed
   */
  public handleContingency(
    event: { type: string, severity: 'low' | 'medium' | 'high', data: any },
    currentPlan: Plan
  ): ResourceAllocationPlan | null {
    console.log(`Handling contingency during execution of plan ${currentPlan.title}`);
    
    // Based on event severity, determine if reallocation is needed
    if (event.severity === 'low') {
      console.log('Low severity event, continuing with current plan');
      return null;
    }
    
    // For medium/high severity, create new allocation
    return this.createResourceAllocationPlan(currentPlan);
  }
  
  // Private utility methods
  
  private estimatePlanCost(plan: Plan): number {
    // Simulate cost estimation based on expected token usage and API calls
    const baseCost = 0.02; // Base cost for any plan
    const taskCost = (plan.tasks?.length || 0) * 0.01; // $0.01 per task
    return baseCost + taskCost;
  }
  
  private estimatePlanValue(plan: Plan, context: Record<string, any>): number {
    // Simulate value estimation based on plan goals and context
    return Math.random() * 0.5 + 0.5; // 0.5 to 1.0 value
  }
  
  private estimatePlanTime(plan: Plan): number {
    // Simulate time estimation in minutes
    return (plan.tasks?.length || 1) * 2; // 2 minutes per task
  }
  
  private calculateRLScore(plan: Plan, context: Record<string, any>): number {
    // Simulate reinforcement learning score
    // In a real implementation, this would use a trained model
    
    // Base score with some randomness
    let score = 0.5 + (Math.random() * 0.3);
    
    // Adjust based on plan complexity
    score -= ((plan.tasks?.length || 0) > 10 ? 0.1 : 0);
    
    // Adjust based on historical performance of similar plans
    const pastSuccess = this.getPastSuccessRate(plan.type || 'default');
    score = (score + pastSuccess) / 2;
    
    return Math.min(1.0, Math.max(0.0, score));
  }
  
  private getPastSuccessRate(planType: string): number {
    // Calculate success rate from decision history
    const relevantDecisions = this.decisionHistory.filter(d => d.plan.type === planType);
    
    if (relevantDecisions.length === 0) {
      return 0.7; // Default optimistic value
    }
    
    const successCount = relevantDecisions.filter(d => d.result.approved).length;
    return successCount / relevantDecisions.length;
  }
  
  private generateRevisions(plan: Plan, context: Record<string, any>): string[] {
    // Generate suggested revisions for rejected plans
    return [
      "Reduce the number of parallel tasks to stay within budget",
      "Focus on higher priority items first",
      "Consider using more specialized agents for complex tasks"
    ];
  }
  
  private suggestAlternativePlan(plan: Plan, context: Record<string, any>): Partial<Plan> {
    // Generate an alternative, less expensive plan
    return {
      title: `Alternative to: ${plan.title}`,
      type: plan.type,
      description: `Simplified version of the original plan with fewer resources`,
      tasks: plan.tasks?.slice(0, Math.ceil((plan.tasks.length || 0) / 2)) // Half the tasks
    };
  }
}

// Export factory function
export function createSeniorManagerGPT(mcpCore: MCPCore, councilService: CouncilService): SeniorManagerGPT {
  return new SeniorManagerGPT(mcpCore, councilService);
}
