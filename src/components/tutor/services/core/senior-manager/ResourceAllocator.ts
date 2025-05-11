
import { MCPCore, TaskPriority } from '../MCPCore';
import { Plan } from '../../frameworks/CrewAIPlanner';

export interface ResourceAllocationPlan {
  agentAssignments: Map<string, string[]>; // agent ID -> task IDs
  councilAssignments: Map<string, string[]>; // council ID -> task IDs
  priority: Record<string, TaskPriority>; // task ID -> priority
  estimatedCompletion: Date;
}

/**
 * Handles resource allocation for plan execution
 */
export class ResourceAllocator {
  private mcpCore: MCPCore;
  
  constructor(mcpCore: MCPCore) {
    this.mcpCore = mcpCore;
  }
  
  /**
   * Create a resource allocation plan for executing a plan
   */
  public createResourceAllocationPlan(plan: Plan): ResourceAllocationPlan {
    console.log(`ResourceAllocator creating allocation for plan: ${plan.title}`);
    
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
   */
  public handleContingency(
    event: { type: string, severity: 'low' | 'medium' | 'high', data: any },
    currentPlan: Plan
  ): ResourceAllocationPlan | null {
    console.log(`ResourceAllocator handling contingency during execution of plan ${currentPlan.title}`);
    
    // Based on event severity, determine if reallocation is needed
    if (event.severity === 'low') {
      console.log('Low severity event, continuing with current plan');
      return null;
    }
    
    // For medium/high severity, create new allocation
    return this.createResourceAllocationPlan(currentPlan);
  }
  
  /**
   * Estimate time for plan execution
   */
  private estimatePlanTime(plan: Plan): number {
    return (plan.tasks?.length || 1) * 2; // 2 minutes per task
  }
}

export function createResourceAllocator(mcpCore: MCPCore): ResourceAllocator {
  return new ResourceAllocator(mcpCore);
}
