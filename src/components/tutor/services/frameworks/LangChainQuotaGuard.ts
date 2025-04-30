
/**
 * Provides rate limiting and quota management for LangChain operations
 * Implements the 'feat/langchain-quota' feature from QuorumForge OS
 */
export class LangChainQuotaGuard {
  private quotaLimits: Map<string, number> = new Map();
  private usageCounters: Map<string, number> = new Map();
  private lastResetTime: Date = new Date();
  private resetIntervalMs: number = 3600000; // 1 hour by default
  
  constructor(resetIntervalMs?: number) {
    if (resetIntervalMs) {
      this.resetIntervalMs = resetIntervalMs;
    }
    
    // Set default quotas
    this.setDefaultQuotas();
  }
  
  /**
   * Sets default quota limits for different chain types
   */
  private setDefaultQuotas(): void {
    this.quotaLimits.set('default', 100);
    this.quotaLimits.set('tutor-chain', 150);
    this.quotaLimits.set('assessment-chain', 75);
    this.quotaLimits.set('cot-reasoning', 50);
    this.quotaLimits.set('knowledge-validation', 200);
  }
  
  /**
   * Set a custom quota limit for a specific chain
   */
  public setQuota(chainId: string, limit: number): void {
    this.quotaLimits.set(chainId, limit);
  }
  
  /**
   * Check if a chain has exceeded its quota
   */
  public hasExceededQuota(chainId: string): boolean {
    this.checkAndResetCounters();
    
    const usage = this.usageCounters.get(chainId) || 0;
    const limit = this.quotaLimits.get(chainId) || this.quotaLimits.get('default') || 100;
    
    return usage >= limit;
  }
  
  /**
   * Increment usage counter for a chain
   */
  public incrementUsage(chainId: string): void {
    this.checkAndResetCounters();
    
    const currentUsage = this.usageCounters.get(chainId) || 0;
    this.usageCounters.set(chainId, currentUsage + 1);
    
    // Log if approaching limit
    const limit = this.quotaLimits.get(chainId) || this.quotaLimits.get('default') || 100;
    if (currentUsage + 1 >= limit * 0.8) {
      console.warn(`LangChain quota warning: Chain ${chainId} is at ${currentUsage + 1}/${limit} (${Math.round((currentUsage + 1) / limit * 100)}%)`);
    }
  }
  
  /**
   * Get current usage statistics
   */
  public getUsageStats(): Record<string, { current: number, limit: number, percentage: number }> {
    const stats: Record<string, { current: number, limit: number, percentage: number }> = {};
    
    this.usageCounters.forEach((usage, chainId) => {
      const limit = this.quotaLimits.get(chainId) || this.quotaLimits.get('default') || 100;
      stats[chainId] = {
        current: usage,
        limit,
        percentage: usage / limit
      };
    });
    
    return stats;
  }
  
  /**
   * Reset counters if interval has passed
   */
  private checkAndResetCounters(): void {
    const now = new Date();
    if (now.getTime() - this.lastResetTime.getTime() > this.resetIntervalMs) {
      console.log('Resetting LangChain quota counters');
      this.usageCounters.clear();
      this.lastResetTime = now;
    }
  }
  
  /**
   * Guard wrapper for LangChain execution
   * Used as decorator pattern implementation
   */
  public async guardedExecute<T>(
    chainId: string, 
    executeFn: () => Promise<T>,
    fallbackFn?: () => Promise<T>
  ): Promise<T> {
    if (this.hasExceededQuota(chainId)) {
      console.warn(`LangChain quota exceeded for chain: ${chainId}`);
      if (fallbackFn) {
        console.log('Using fallback function for quota-exceeded chain');
        return fallbackFn();
      }
      throw new Error(`Quota exceeded for chain: ${chainId}`);
    }
    
    this.incrementUsage(chainId);
    return executeFn();
  }
}
