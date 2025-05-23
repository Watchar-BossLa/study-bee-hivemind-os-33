
/**
 * AutogenTurnGuard - Implements the autogen-turnguard feature from QuorumForge OS spec
 * Caps Autogen threads (max_turns) to constrain cost/loops
 */
export class AutogenTurnGuard {
  private defaultMaxTurns: number = 6;
  private turnLimits: Map<string, number> = new Map();
  
  constructor(defaultMaxTurns: number = 6) {
    this.defaultMaxTurns = defaultMaxTurns;
  }
  
  /**
   * Get the default maximum number of turns for a thread
   */
  public getDefaultMaxTurns(): number {
    return this.defaultMaxTurns;
  }
  
  /**
   * Set the default maximum number of turns for new threads
   */
  public setDefaultMaxTurns(maxTurns: number): void {
    if (maxTurns < 1) {
      throw new Error("Maximum turns must be at least 1");
    }
    this.defaultMaxTurns = maxTurns;
  }
  
  /**
   * Set a custom turn limit for a specific thread
   */
  public setTurnLimit(threadId: string, maxTurns: number): void {
    if (maxTurns < 1) {
      throw new Error("Maximum turns must be at least 1");
    }
    this.turnLimits.set(threadId, maxTurns);
  }
  
  /**
   * Get the turn limit for a specific thread
   */
  public getTurnLimit(threadId: string): number {
    return this.turnLimits.get(threadId) || this.defaultMaxTurns;
  }
  
  /**
   * Check if a thread has reached its turn limit
   */
  public hasReachedLimit(threadId: string, currentTurns: number): boolean {
    const limit = this.getTurnLimit(threadId);
    return currentTurns >= limit;
  }
  
  /**
   * Get all thread limits
   */
  public getAllLimits(): Map<string, number> {
    return new Map(this.turnLimits);
  }
  
  /**
   * Reset a specific thread's limit to the default
   */
  public resetThreadLimit(threadId: string): void {
    this.turnLimits.delete(threadId);
  }
  
  /**
   * Reset all thread limits
   */
  public resetAllLimits(): void {
    this.turnLimits.clear();
  }
}
