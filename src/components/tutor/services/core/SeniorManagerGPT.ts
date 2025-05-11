
import { MCPCore } from './MCPCore';
import { CouncilService } from '../CouncilService';
import { Plan } from '../frameworks/CrewAIPlanner';
import { PlanReviewer, createPlanReviewer } from './senior-manager/PlanReviewer';
import { ResourceAllocator, createResourceAllocator } from './senior-manager/ResourceAllocator';
import { ContingencyHandler, createContingencyHandler } from './senior-manager/ContingencyHandler';
import { BudgetManager, createBudgetManager } from './senior-manager/BudgetManager';

/**
 * SeniorManagerGPT - Executive decision maker in the QuorumForge OS
 * Oversees plan approval, resource allocation, and contingency handling
 */
export class SeniorManagerGPT {
  private mcpCore: MCPCore;
  private planReviewer: PlanReviewer;
  private resourceAllocator: ResourceAllocator;
  private contingencyHandler: ContingencyHandler;
  private budgetManager: BudgetManager;
  
  constructor(
    mcpCore: MCPCore,
    councilService: CouncilService
  ) {
    this.mcpCore = mcpCore;
    
    // Initialize subcomponents
    this.resourceAllocator = createResourceAllocator(mcpCore);
    this.contingencyHandler = createContingencyHandler(this.resourceAllocator);
    this.planReviewer = createPlanReviewer(councilService);
    this.budgetManager = createBudgetManager();
    
    console.log('SeniorManagerGPT initialized');
  }
  
  /**
   * Review a plan created by CrewAI
   * @param plan The plan to review
   * @param context Additional context for the review
   */
  public async reviewPlan(plan: Plan, context: Record<string, any> = {}): Promise<any> {
    console.log(`SeniorManagerGPT reviewing plan: ${plan.title || 'Untitled'}`);
    
    // Check budget constraints
    const estimatedCost = this.estimatePlanCost(plan);
    if (!this.budgetManager.isWithinBudget(estimatedCost, 'medium')) {
      console.log(`Plan rejected due to budget constraints (est. cost: $${estimatedCost})`);
      return {
        approved: false,
        reason: "Budget constraints exceeded",
        estimatedCost,
        availableBudget: this.budgetManager.getAvailableBudget('medium')
      };
    }
    
    // Review plan for technical feasibility and security
    const reviewResult = await this.planReviewer.reviewPlan(plan, context);
    
    if (reviewResult.review.status !== 'approved') {
      console.log(`Plan rejected: ${reviewResult.review.technicalIssues.join(', ')}`);
      return {
        approved: false,
        reason: "Technical or security issues",
        issues: reviewResult.review.technicalIssues,
        securityConcerns: reviewResult.review.securityConcerns
      };
    }
    
    // Create resource allocation plan
    const allocationPlan = this.resourceAllocator.createResourceAllocationPlan(plan);
    
    // Record budget allocation
    this.budgetManager.recordUsage(
      (plan.tasks?.length || 1) * 1000, // Simulated token usage
      estimatedCost
    );
    
    return {
      approved: true,
      allocationPlan,
      estimatedCompletion: allocationPlan.estimatedCompletion,
      plan: reviewResult
    };
  }
  
  /**
   * Handle an unexpected event during plan execution
   * @param event The event to handle
   * @param currentPlan The current plan being executed
   */
  public handleContingency(
    event: {
      type: string;
      severity: 'low' | 'medium' | 'high';
      timestamp: Date;
      data: any;
    },
    currentPlan: Plan
  ): any {
    console.log(`SeniorManagerGPT handling contingency: ${event.type}`);
    
    // Delegate to contingency handler
    const newAllocationPlan = this.contingencyHandler.handleEvent(event, currentPlan);
    
    if (newAllocationPlan) {
      return {
        action: "reallocation",
        plan: newAllocationPlan
      };
    }
    
    return {
      action: "continue",
      message: "Continue with current plan"
    };
  }
  
  /**
   * Get current budget and usage metrics
   */
  public getBudgetMetrics(): Record<string, any> {
    return this.budgetManager.getUsageMetrics();
  }
  
  /**
   * Estimate the cost of executing a plan
   * @param plan The plan to estimate
   */
  private estimatePlanCost(plan: Plan): number {
    // Simple cost estimation based on task count
    const baseTaskCost = 0.01; // $0.01 per task
    const taskCount = plan.tasks?.length || 1;
    
    // Add complexity factor based on types of tasks
    const complexityFactor = 1.2;
    
    return baseTaskCost * taskCount * complexityFactor;
  }
}

// Export factory function
export function createSeniorManagerGPT(
  mcpCore: MCPCore,
  councilService: CouncilService
): SeniorManagerGPT {
  return new SeniorManagerGPT(mcpCore, councilService);
}
