
import { Plan } from '../../frameworks/CrewAIPlanner';

export interface PlanReviewResult {
  approved: boolean;
  score: number;
  feedback: string;
  suggestedRevisions?: string[];
  estimatedCost?: number;
  estimatedTime?: number;
  alternativePlan?: Partial<Plan>;
}

/**
 * Handles plan review decisions for SeniorManagerGPT
 */
export class PlanReviewer {
  private budgetThresholds: Record<string, number> = {
    low: 0.05,    // $0.05 threshold
    medium: 0.25, // $0.25 threshold
    high: 1.0     // $1.00 threshold
  };
  
  private decisionHistory: Array<{plan: Plan, result: PlanReviewResult}> = [];
  
  /**
   * Review a plan created by a council or agent
   */
  public reviewPlan(plan: Plan, context: Record<string, any> = {}): PlanReviewResult {
    console.log(`PlanReviewer reviewing plan: ${plan.title}`);
    
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
   * Estimate the cost of executing a plan based on tasks and resources
   */
  private estimatePlanCost(plan: Plan): number {
    // Simulate cost estimation based on expected token usage and API calls
    const baseCost = 0.02; // Base cost for any plan
    const taskCost = (plan.tasks?.length || 0) * 0.01; // $0.01 per task
    return baseCost + taskCost;
  }
  
  /**
   * Estimate the value the plan will deliver
   */
  private estimatePlanValue(plan: Plan, context: Record<string, any>): number {
    // Simulate value estimation based on plan goals and context
    return Math.random() * 0.5 + 0.5; // 0.5 to 1.0 value
  }
  
  /**
   * Estimate time required to execute the plan
   */
  private estimatePlanTime(plan: Plan): number {
    // Simulate time estimation in minutes
    return (plan.tasks?.length || 1) * 2; // 2 minutes per task
  }
  
  /**
   * Calculate RL-based score for the plan
   */
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
  
  /**
   * Get success rate of past plans of the same type
   */
  private getPastSuccessRate(planType: string): number {
    // Calculate success rate from decision history
    const relevantDecisions = this.decisionHistory.filter(d => d.plan.type === planType);
    
    if (relevantDecisions.length === 0) {
      return 0.7; // Default optimistic value
    }
    
    const successCount = relevantDecisions.filter(d => d.result.approved).length;
    return successCount / relevantDecisions.length;
  }
  
  /**
   * Generate suggested revisions for rejected plans
   */
  private generateRevisions(plan: Plan, context: Record<string, any>): string[] {
    // Generate suggested revisions for rejected plans
    return [
      "Reduce the number of parallel tasks to stay within budget",
      "Focus on higher priority items first",
      "Consider using more specialized agents for complex tasks"
    ];
  }
  
  /**
   * Suggest an alternative plan with reduced scope or cost
   */
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

export function createPlanReviewer(): PlanReviewer {
  return new PlanReviewer();
}
