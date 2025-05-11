
import { SpecializedAgent } from '../../types/agents';
import { Plan } from '../frameworks/CrewAIPlanner';
import { MCPCore, TaskPriority } from './MCPCore';
import { CouncilService } from '../CouncilService';
import { PlanReviewer, PlanReviewResult } from './senior-manager/PlanReviewer';
import { ResourceAllocator, ResourceAllocationPlan } from './senior-manager/ResourceAllocator';
import { ContingencyHandler } from './senior-manager/ContingencyHandler';
import { BudgetManager } from './senior-manager/BudgetManager';

/**
 * SeniorManagerGPT - Executive decision maker for agent orchestration
 * Implements the RL-based plan selector as defined in QuorumForge OS spec
 */
export class SeniorManagerGPT {
  private mcpCore: MCPCore;
  private councilService: CouncilService;
  private planReviewer: PlanReviewer;
  private resourceAllocator: ResourceAllocator;
  private contingencyHandler: ContingencyHandler;
  private budgetManager: BudgetManager;
  
  constructor(mcpCore: MCPCore, councilService: CouncilService) {
    this.mcpCore = mcpCore;
    this.councilService = councilService;
    
    // Initialize components
    this.planReviewer = createPlanReviewer();
    this.resourceAllocator = createResourceAllocator(mcpCore);
    this.contingencyHandler = createContingencyHandler(this.resourceAllocator);
    this.budgetManager = createBudgetManager();
    
    console.log('SeniorManagerGPT initialized with all components');
  }
  
  /**
   * Review a plan created by a council or agent
   */
  public async reviewPlan(plan: Plan, context: Record<string, any> = {}): Promise<PlanReviewResult> {
    console.log(`SeniorManagerGPT reviewing plan: ${plan.title}`);
    return this.planReviewer.reviewPlan(plan, context);
  }
  
  /**
   * Create a resource allocation plan for executing a plan
   */
  public createResourceAllocationPlan(plan: Plan): ResourceAllocationPlan {
    return this.resourceAllocator.createResourceAllocationPlan(plan);
  }
  
  /**
   * Handle an unexpected event during plan execution
   */
  public handleContingency(
    event: { type: string, severity: 'low' | 'medium' | 'high', data: any },
    currentPlan: Plan
  ): ResourceAllocationPlan | null {
    return this.contingencyHandler.handleEvent({
      ...event,
      timestamp: new Date()
    }, currentPlan);
  }
  
  /**
   * Check if a proposed cost is within budget
   */
  public isWithinBudget(proposedCost: number, budgetLevel: string = 'medium'): boolean {
    return this.budgetManager.isWithinBudget(proposedCost, budgetLevel);
  }
  
  /**
   * Get usage metrics
   */
  public getUsageMetrics(): {tokenUsage: Record<string, number>, costTracking: Record<string, number>} {
    return this.budgetManager.getUsageMetrics();
  }
}

// Export factory function
export function createSeniorManagerGPT(mcpCore: MCPCore, councilService: CouncilService): SeniorManagerGPT {
  return new SeniorManagerGPT(mcpCore, councilService);
}
