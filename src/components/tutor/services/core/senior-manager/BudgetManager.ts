
/**
 * Handles budget management for SeniorManagerGPT
 */
export class BudgetManager {
  private budgetThresholds: Record<string, number> = {
    low: 0.05,    // $0.05 threshold
    medium: 0.25, // $0.25 threshold
    high: 1.0     // $1.00 threshold
  };
  
  private tokenUsage: Record<string, number> = {
    total: 0,
    lastHour: 0,
    lastDay: 0
  };
  
  private costTracking: Record<string, number> = {
    total: 0,
    lastHour: 0,
    lastDay: 0
  };
  
  /**
   * Check if a proposed cost is within budget
   */
  public isWithinBudget(proposedCost: number, budgetLevel: string = 'medium'): boolean {
    const threshold = this.budgetThresholds[budgetLevel] || this.budgetThresholds.medium;
    return proposedCost <= threshold;
  }
  
  /**
   * Get available budget for a given level
   */
  public getAvailableBudget(budgetLevel: string = 'medium'): number {
    const threshold = this.budgetThresholds[budgetLevel] || this.budgetThresholds.medium;
    return threshold - this.costTracking.lastHour;
  }
  
  /**
   * Record token usage and cost
   */
  public recordUsage(tokens: number, cost: number): void {
    this.tokenUsage.total += tokens;
    this.tokenUsage.lastHour += tokens;
    this.tokenUsage.lastDay += tokens;
    
    this.costTracking.total += cost;
    this.costTracking.lastHour += cost;
    this.costTracking.lastDay += cost;
  }
  
  /**
   * Reset hourly tracking
   */
  public resetHourlyTracking(): void {
    this.tokenUsage.lastHour = 0;
    this.costTracking.lastHour = 0;
  }
  
  /**
   * Reset daily tracking
   */
  public resetDailyTracking(): void {
    this.tokenUsage.lastDay = 0;
    this.costTracking.lastDay = 0;
  }
  
  /**
   * Get current usage metrics
   */
  public getUsageMetrics(): {tokenUsage: Record<string, number>, costTracking: Record<string, number>} {
    return {
      tokenUsage: {...this.tokenUsage},
      costTracking: {...this.costTracking}
    };
  }
}

export function createBudgetManager(): BudgetManager {
  return new BudgetManager();
}
