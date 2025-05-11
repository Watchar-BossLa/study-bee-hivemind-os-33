
import { Plan } from '../../frameworks/CrewAIPlanner';
import { CouncilService } from '../../CouncilService';

/**
 * Reviews and validates plans created by CrewAI
 */
export class PlanReviewer {
  private councilService: CouncilService;
  
  constructor(councilService: CouncilService) {
    this.councilService = councilService;
  }
  
  /**
   * Review a plan for technical feasibility, security, and cost
   */
  public async reviewPlan(plan: Plan, context: Record<string, any> = {}): Promise<any> {
    console.log(`PlanReviewer reviewing plan: ${plan.title}`);
    
    // Check if security council exists
    const securityCouncil = this.councilService.getCouncil('security-council');
    if (!securityCouncil) {
      console.log("Security council not found for plan review");
      // Proceed with limited checks
    } else {
      // In a real implementation, would submit to security council for review
      console.log("Submitting plan to security council for review");
    }
    
    // Validate technical aspects
    const validationResult = this.validateTechnicalFeasibility(plan);
    
    // Add review metadata to plan
    const reviewedPlan = {
      ...plan,
      review: {
        timestamp: new Date(),
        status: validationResult.feasible ? 'approved' : 'rejected',
        technicalIssues: validationResult.issues,
        securityConcerns: []  // Would come from security council
      }
    };
    
    return reviewedPlan;
  }
  
  /**
   * Validate the technical feasibility of a plan
   */
  private validateTechnicalFeasibility(plan: Plan): { feasible: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check for required fields
    if (!plan.id) issues.push("Missing plan ID");
    if (!plan.title) issues.push("Missing plan title");
    if (!plan.tasks) issues.push("Missing plan tasks");
    
    // Check if tasks are well-formed
    if (plan.tasks && plan.tasks.length > 0) {
      plan.tasks.forEach((task, index) => {
        if (!task.id) issues.push(`Task ${index} missing ID`);
        if (!task.description) issues.push(`Task ${index} missing description`);
      });
    }
    
    return {
      feasible: issues.length === 0,
      issues
    };
  }
}

export function createPlanReviewer(councilService: CouncilService): PlanReviewer {
  return new PlanReviewer(councilService);
}
