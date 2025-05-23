
/**
 * LangChain Quota Guard - Implements rate limiting for LangChain chains
 * Implements the langchain-quota feature from QuorumForge OS spec
 */
export class LangChainQuotaGuard {
  private quotaLimits: Map<string, { limit: number; current: number; resetAt: Date }>;
  
  constructor() {
    this.quotaLimits = new Map();
    this.initializeDefaultQuotas();
    
    console.log('LangChain Quota Guard initialized');
  }
  
  private initializeDefaultQuotas() {
    // Default quotas for common chain types
    const defaultQuotas: [string, number][] = [
      ['tutor-chain', 150],
      ['assessment-chain', 75],
      ['cot-reasoning', 50],
      ['summarization', 100],
      ['knowledge-retrieval', 200]
    ];
    
    // Initialize quota trackers
    const now = new Date();
    // Set reset time to the next hour
    const resetAt = new Date(now);
    resetAt.setHours(resetAt.getHours() + 1);
    resetAt.setMinutes(0, 0, 0);
    
    for (const [chainName, limit] of defaultQuotas) {
      this.quotaLimits.set(chainName, { limit, current: 0, resetAt });
    }
  }
  
  /**
   * Guard a chain call by enforcing quota limits
   */
  public guardChain(chainName: string): boolean {
    // Get the quota for this chain, or create a default one
    let quota = this.quotaLimits.get(chainName);
    if (!quota) {
      const now = new Date();
      const resetAt = new Date(now);
      resetAt.setHours(resetAt.getHours() + 1);
      resetAt.setMinutes(0, 0, 0);
      
      quota = { limit: 50, current: 0, resetAt };
      this.quotaLimits.set(chainName, quota);
    }
    
    // Check if we need to reset the quota
    const now = new Date();
    if (now >= quota.resetAt) {
      const newResetAt = new Date(now);
      newResetAt.setHours(newResetAt.getHours() + 1);
      newResetAt.setMinutes(0, 0, 0);
      
      quota = { limit: quota.limit, current: 0, resetAt: newResetAt };
      this.quotaLimits.set(chainName, quota);
    }
    
    // Check if the chain is over quota
    if (quota.current >= quota.limit) {
      console.warn(`Chain ${chainName} is over quota (${quota.current}/${quota.limit})`);
      return false;
    }
    
    // Increment usage
    quota.current++;
    this.quotaLimits.set(chainName, quota);
    return true;
  }
  
  /**
   * Get current quota usage for all chains
   */
  public getQuotaUsage(): Record<string, { current: number; limit: number; percentage: number }> {
    const usage: Record<string, { current: number; limit: number; percentage: number }> = {};
    
    for (const [chainName, quota] of this.quotaLimits.entries()) {
      usage[chainName] = {
        current: quota.current,
        limit: quota.limit,
        percentage: quota.current / quota.limit
      };
    }
    
    return usage;
  }
  
  /**
   * Set a custom quota limit for a chain
   */
  public setQuotaLimit(chainName: string, limit: number): void {
    const quota = this.quotaLimits.get(chainName);
    if (quota) {
      quota.limit = limit;
      this.quotaLimits.set(chainName, quota);
    } else {
      const now = new Date();
      const resetAt = new Date(now);
      resetAt.setHours(resetAt.getHours() + 1);
      resetAt.setMinutes(0, 0, 0);
      
      this.quotaLimits.set(chainName, { limit, current: 0, resetAt });
    }
  }
}
