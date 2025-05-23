
import { MCPCore } from './MCPCore';
import { CouncilService } from '../CouncilService';
import { Plan } from '../frameworks/CrewAIPlanner';
import { PlanReviewer, createPlanReviewer } from './senior-manager/PlanReviewer';
import { ResourceAllocator, createResourceAllocator } from './senior-manager/ResourceAllocator';
import { ContingencyHandler, createContingencyHandler } from './senior-manager/ContingencyHandler';
import { BudgetManager, createBudgetManager } from './senior-manager/BudgetManager';
import { CrewAIPlanner } from '../frameworks/CrewAIPlanner';
import { LLMRouter } from '../LLMRouter';

/**
 * SeniorManagerGPT - Executive decision maker in the QuorumForge OS
 * Implements the crewai-senior feature from QuorumForge OS spec
 */
export class SeniorManagerGPT {
  private mcpCore: MCPCore;
  private planReviewer: PlanReviewer;
  private resourceAllocator: ResourceAllocator;
  private contingencyHandler: ContingencyHandler;
  private budgetManager: BudgetManager;
  private crewAIPlanner: CrewAIPlanner;
  
  constructor(
    mcpCore: MCPCore,
    councilService: CouncilService,
    router: LLMRouter
  ) {
    this.mcpCore = mcpCore;
    
    // Initialize subcomponents
    this.resourceAllocator = createResourceAllocator(mcpCore);
    this.contingencyHandler = createContingencyHandler(this.resourceAllocator);
    this.planReviewer = createPlanReviewer(councilService);
    this.budgetManager = createBudgetManager();
    this.crewAIPlanner = new CrewAIPlanner(councilService, router);
    
    console.log('SeniorManagerGPT initialized');
  }
  
  /**
   * Create a plan for a topic using CrewAI
   * @param topic The topic to create a plan for
   * @param councilId The council to use for planning
   * @param context Additional context
   */
  public async createPlan(
    topic: string,
    councilId: string,
    context: Record<string, any> = {}
  ): Promise<Plan> {
    console.log(`SeniorManagerGPT creating plan for topic: ${topic} using council: ${councilId}`);
    
    // Use CrewAI to create the plan
    const plan = await this.crewAIPlanner.createPlan(topic, councilId, context);
    
    // Review the plan
    const reviewResult = await this.reviewPlan(plan, context);
    
    if (!reviewResult.approved) {
      console.log(`Plan rejected: ${reviewResult.reason}`);
      // Try again with modifications based on review feedback
      const modifiedContext = {
        ...context,
        previousReview: reviewResult,
        iteration: (context.iteration || 0) + 1
      };
      
      if (modifiedContext.iteration <= 3) {
        return this.createPlan(topic, councilId, modifiedContext);
      } else {
        throw new Error(`Failed to create an acceptable plan after 3 iterations: ${reviewResult.reason}`);
      }
    }
    
    return plan;
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
    
    if (reviewResult.review?.status !== 'approved') {
      console.log(`Plan rejected: ${reviewResult.review?.technicalIssues?.join(', ')}`);
      return {
        approved: false,
        reason: "Technical or security issues",
        issues: reviewResult.review?.technicalIssues,
        securityConcerns: reviewResult.review?.securityConcerns
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
   * Execute a plan using CrewAI
   * @param plan The plan to execute
   * @param context Additional context
   */
  public async executePlan(plan: Plan, context: Record<string, any> = {}): Promise<any> {
    console.log(`SeniorManagerGPT executing plan: ${plan.title || 'Untitled'}`);
    
    // Get allocation plan
    const allocationPlan = this.resourceAllocator.createResourceAllocationPlan(plan);
    
    try {
      // Execute the plan using CrewAI
      const results = await this.crewAIPlanner.executePlan(plan, context);
      
      // Record successful execution
      this.budgetManager.recordTaskCompletion(plan.id, true);
      
      return {
        success: true,
        results,
        executionTime: new Date()
      };
    } catch (error) {
      console.error(`Error executing plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Handle contingency
      const contingencyPlan = this.contingencyHandler.handleContingency(
        {
          type: 'plan_execution_failed',
          severity: 'high',
          timestamp: new Date(),
          data: {
            error: error instanceof Error ? error.message : 'Unknown error',
            plan
          }
        },
        plan
      );
      
      // Record failed execution
      this.budgetManager.recordTaskCompletion(plan.id, false);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        contingencyPlan
      };
    }
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
  councilService: CouncilService,
  router: LLMRouter
): SeniorManagerGPT {
  return new SeniorManagerGPT(mcpCore, councilService, router);
}
