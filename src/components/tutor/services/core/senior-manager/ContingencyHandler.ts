
import { Plan } from '../../frameworks/CrewAIPlanner';
import { ResourceAllocator, ResourceAllocationPlan } from './ResourceAllocator';

export interface ContingencyEvent {
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  data: any;
  source?: string;
}

/**
 * Handles unexpected events during plan execution
 */
export class ContingencyHandler {
  private resourceAllocator: ResourceAllocator;
  private eventHistory: ContingencyEvent[] = [];
  
  constructor(resourceAllocator: ResourceAllocator) {
    this.resourceAllocator = resourceAllocator;
  }
  
  /**
   * Handle an unexpected event during plan execution
   */
  public handleEvent(event: ContingencyEvent, currentPlan: Plan): ResourceAllocationPlan | null {
    console.log(`ContingencyHandler processing ${event.severity} event of type ${event.type}`);
    
    // Record event for analysis
    this.eventHistory.push(event);
    
    // Delegate to resource allocator for reallocation if needed
    return this.resourceAllocator.handleContingency(event, currentPlan);
  }
  
  /**
   * Get event history for analysis
   */
  public getEventHistory(): ContingencyEvent[] {
    return [...this.eventHistory];
  }
  
  /**
   * Clear event history
   */
  public clearEventHistory(): void {
    this.eventHistory = [];
  }
}

export function createContingencyHandler(resourceAllocator: ResourceAllocator): ContingencyHandler {
  return new ContingencyHandler(resourceAllocator);
}
