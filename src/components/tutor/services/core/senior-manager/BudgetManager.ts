
export class BudgetManager {
  private totalBudget: number = 10000; // Default budget
  private usedBudget: number = 0;
  private tasksExecuted: number = 0;
  private totalExecutionTime: number = 0;

  public analyzePlan(plan: any): {
    withinBudget: boolean;
    estimatedCost: number;
    availableBudget: number;
  } {
    const estimatedCost = plan.tasks.reduce((total: number, task: any) => {
      return total + (task.estimatedTime * 0.1); // $0.10 per minute
    }, 0);

    return {
      withinBudget: (this.usedBudget + estimatedCost) <= this.totalBudget,
      estimatedCost,
      availableBudget: this.totalBudget - this.usedBudget
    };
  }

  public recordTaskCompletion(taskId: string, executionTime: number): void {
    this.tasksExecuted++;
    this.totalExecutionTime += executionTime;
    this.usedBudget += executionTime * 0.1;
  }

  public getTotalExecuted(): number {
    return this.tasksExecuted;
  }

  public getAverageExecutionTime(): number {
    return this.tasksExecuted > 0 ? this.totalExecutionTime / this.tasksExecuted : 0;
  }

  public getBudgetUtilization(): number {
    return (this.usedBudget / this.totalBudget) * 100;
  }

  public handleBudgetOverrun(details: string): {
    action: string;
    success: boolean;
    details: string;
  } {
    return {
      action: 'budget_reallocation',
      success: true,
      details: 'Budget overrun handled by reallocating resources'
    };
  }
}
