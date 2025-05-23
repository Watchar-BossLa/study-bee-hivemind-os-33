
/**
 * Autogen Turn Guard - Caps the number of turns in Autogen threads
 * Implements the autogen-turnguard feature from QuorumForge OS spec
 */
export class AutogenTurnGuard {
  private defaultMaxTurns: number;
  private threadLimits: Map<string, number>;
  private threadTurnCounts: Map<string, number>;
  
  constructor(defaultMaxTurns: number = 6) {
    this.defaultMaxTurns = defaultMaxTurns;
    this.threadLimits = new Map();
    this.threadTurnCounts = new Map();
    
    console.log(`Autogen Turn Guard initialized with default max turns: ${defaultMaxTurns}`);
  }
  
  /**
   * Register a new thread with optional custom turn limit
   */
  public registerThread(threadId: string, maxTurns?: number): void {
    this.threadLimits.set(threadId, maxTurns || this.defaultMaxTurns);
    this.threadTurnCounts.set(threadId, 0);
    
    console.log(`Registered thread ${threadId} with max turns: ${maxTurns || this.defaultMaxTurns}`);
  }
  
  /**
   * Record a turn in a thread and check if the limit is reached
   */
  public recordTurn(threadId: string): boolean {
    // If thread doesn't exist, register it with default limits
    if (!this.threadLimits.has(threadId)) {
      this.registerThread(threadId);
    }
    
    // Get current turn count
    const currentTurns = this.threadTurnCounts.get(threadId) || 0;
    const maxTurns = this.threadLimits.get(threadId) || this.defaultMaxTurns;
    
    // Increment turn count
    this.threadTurnCounts.set(threadId, currentTurns + 1);
    
    // Check if we've reached the limit
    const isLimitReached = (currentTurns + 1) >= maxTurns;
    
    if (isLimitReached) {
      console.log(`Thread ${threadId} has reached turn limit (${maxTurns})`);
    }
    
    return isLimitReached;
  }
  
  /**
   * Get current turn count for a thread
   */
  public getTurnCount(threadId: string): number {
    return this.threadTurnCounts.get(threadId) || 0;
  }
  
  /**
   * Get max turn limit for a thread
   */
  public getTurnLimit(threadId: string): number {
    return this.threadLimits.get(threadId) || this.defaultMaxTurns;
  }
  
  /**
   * Reset turn count for a thread
   */
  public resetTurnCount(threadId: string): void {
    this.threadTurnCounts.set(threadId, 0);
  }
  
  /**
   * Update max turn limit for a thread
   */
  public updateTurnLimit(threadId: string, maxTurns: number): void {
    this.threadLimits.set(threadId, maxTurns);
  }
  
  /**
   * Get all active thread IDs
   */
  public getActiveThreads(): string[] {
    return Array.from(this.threadLimits.keys());
  }
}
