
import { LLMRouter } from '../LLMRouter';
import { MCPCore } from './MCPCore';
import { BudgetManager } from './senior-manager/BudgetManager';
import { ContingencyHandler } from './senior-manager/ContingencyHandler';
import { PlanReviewer } from './senior-manager/PlanReviewer';
import { ResourceAllocator } from './senior-manager/ResourceAllocator';

interface Plan {
  id: string;
  title: string;
  description: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: number;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    estimatedTime: number;
  }>;
  status: 'draft' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  createdBy: string;
}

interface ExecutionResult {
  planId: string;
  success: boolean;
  executedTasks: Array<{
    taskId: string;
    result: string;
    success: boolean;
    executionTime: number;
  }>;
  totalTime: number;
  failureReason?: string;
}

/**
 * SeniorManagerGPT - Meta-agent executive for approving plans and managing resources
 */
export class SeniorManagerGPT {
  private llmRouter: LLMRouter;
  private mcpCore: MCPCore;
  private budgetManager: BudgetManager;
  private contingencyHandler: ContingencyHandler;
  private planReviewer: PlanReviewer;
  private resourceAllocator: ResourceAllocator;
  
  constructor(llmRouter: LLMRouter, mcpCore: MCPCore) {
    this.llmRouter = llmRouter;
    this.mcpCore = mcpCore;
    this.budgetManager = new BudgetManager();
    this.contingencyHandler = new ContingencyHandler();
    this.planReviewer = new PlanReviewer();
    this.resourceAllocator = new ResourceAllocator();
  }
  
  /**
   * Review and approve/reject a plan
   */
  public async reviewPlan(plan: Plan): Promise<{
    approved: boolean;
    feedback: string;
    modifications?: Partial<Plan>;
    budgetAllocation?: Record<string, number>;
  }> {
    console.log(`SeniorManagerGPT reviewing plan: ${plan.id}`);
    
    // Check budget constraints
    const budgetAnalysis = this.budgetManager.analyzePlan(plan);
    if (!budgetAnalysis.withinBudget) {
      return {
        approved: false,
        feedback: `Plan exceeds budget constraints. Required: ${budgetAnalysis.estimatedCost}, Available: ${budgetAnalysis.availableBudget}`
      };
    }
    
    // Review plan quality and feasibility
    const reviewResult = this.planReviewer.reviewPlan(plan);
    if (!reviewResult.approved) {
      return {
        approved: false,
        feedback: reviewResult.feedback,
        modifications: reviewResult.suggestedModifications
      };
    }
    
    // Allocate resources
    const resourceAllocation = this.resourceAllocator.allocateResources(plan);
    
    return {
      approved: true,
      feedback: 'Plan approved with resource allocation',
      budgetAllocation: resourceAllocation.budgetAllocation
    };
  }
  
  /**
   * Execute an approved plan
   */
  public async executePlan(plan: Plan): Promise<ExecutionResult> {
    console.log(`SeniorManagerGPT executing plan: ${plan.id}`);
    
    const startTime = Date.now();
    const executedTasks: ExecutionResult['executedTasks'] = [];
    let success = true;
    let failureReason: string | undefined;
    
    try {
      // Execute tasks in priority order
      const sortedTasks = [...plan.tasks].sort((a, b) => a.priority - b.priority);
      
      for (const task of sortedTasks) {
        const taskStartTime = Date.now();
        
        try {
          // Submit task to MCP Core for execution
          const taskId = await this.mcpCore.submitTask({
            type: 'execute_task',
            payload: {
              taskId: task.id,
              description: task.description,
              priority: task.priority
            }
          });
          
          // Wait for task completion
          const result = await this.mcpCore.waitForTaskCompletion(taskId);
          
          const executionTime = Date.now() - taskStartTime;
          
          executedTasks.push({
            taskId: task.id,
            result: result.result || 'Task completed successfully',
            success: true,
            executionTime
          });
          
          // Record task completion for budget tracking
          this.budgetManager.recordTaskCompletion?.(task.id, executionTime);
          
        } catch (error) {
          const executionTime = Date.now() - taskStartTime;
          
          // Handle task failure
          const contingencyResult = this.contingencyHandler.handleContingency?.(task, error as Error);
          
          executedTasks.push({
            taskId: task.id,
            result: contingencyResult?.message || `Task failed: ${(error as Error).message}`,
            success: false,
            executionTime
          });
          
          if (!contingencyResult?.canContinue) {
            success = false;
            failureReason = `Critical task ${task.id} failed: ${(error as Error).message}`;
            break;
          }
        }
        
        // Record task completion for budget tracking
        this.budgetManager.recordTaskCompletion?.(task.id, Date.now() - taskStartTime);
      }
      
    } catch (error) {
      success = false;
      failureReason = `Plan execution failed: ${(error as Error).message}`;
    }
    
    const totalTime = Date.now() - startTime;
    
    return {
      planId: plan.id,
      success,
      executedTasks,
      totalTime,
      failureReason
    };
  }
  
  /**
   * Get execution status and metrics
   */
  public getExecutionMetrics(): {
    totalPlansReviewed: number;
    totalPlansApproved: number;
    totalPlansExecuted: number;
    averageExecutionTime: number;
    budgetUtilization: number;
  } {
    return {
      totalPlansReviewed: this.planReviewer.getTotalReviewed(),
      totalPlansApproved: this.planReviewer.getTotalApproved(),
      totalPlansExecuted: this.budgetManager.getTotalExecuted(),
      averageExecutionTime: this.budgetManager.getAverageExecutionTime(),
      budgetUtilization: this.budgetManager.getBudgetUtilization()
    };
  }
  
  /**
   * Handle emergency situations and contingencies
   */
  public async handleEmergency(emergency: {
    type: 'budget_exceeded' | 'task_failure' | 'resource_shortage' | 'security_breach';
    details: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<{
    action: string;
    success: boolean;
    details: string;
  }> {
    console.log(`SeniorManagerGPT handling emergency: ${emergency.type}`);
    
    switch (emergency.type) {
      case 'budget_exceeded':
        return this.budgetManager.handleBudgetOverrun(emergency.details);
      
      case 'task_failure':
        return this.contingencyHandler.handleTaskFailure(emergency.details);
      
      case 'resource_shortage':
        return this.resourceAllocator.handleResourceShortage(emergency.details);
      
      case 'security_breach':
        return {
          action: 'security_lockdown',
          success: true,
          details: 'Emergency security protocols activated'
        };
      
      default:
        return {
          action: 'unknown_emergency',
          success: false,
          details: 'Unknown emergency type, manual intervention required'
        };
    }
  }
}
