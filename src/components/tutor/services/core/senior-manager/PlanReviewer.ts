
export class PlanReviewer {
  private totalReviewed: number = 0;
  private totalApproved: number = 0;

  public reviewPlan(plan: any): {
    approved: boolean;
    feedback: string;
    suggestedModifications?: any;
  } {
    this.totalReviewed++;
    
    // Simple review logic
    if (plan.tasks.length === 0) {
      return {
        approved: false,
        feedback: 'Plan must contain at least one task'
      };
    }

    this.totalApproved++;
    return {
      approved: true,
      feedback: 'Plan approved for execution'
    };
  }

  public getTotalReviewed(): number {
    return this.totalReviewed;
  }

  public getTotalApproved(): number {
    return this.totalApproved;
  }
}
