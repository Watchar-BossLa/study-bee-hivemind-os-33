
/**
 * Provides turn limits and monitoring for Autogen thread execution
 * Implements the 'feat/autogen-turnguard' feature from QuorumForge OS
 */
export class AutogenTurnGuard {
  private defaultMaxTurns: number = 6;
  private turnCounters: Map<string, number> = new Map();
  private activeSessions: Set<string> = new Set();
  
  /**
   * Start tracking a new Autogen thread session
   */
  public startSession(sessionId: string, maxTurns?: number): { sessionId: string, maxTurns: number } {
    const actualMaxTurns = maxTurns || this.defaultMaxTurns;
    this.turnCounters.set(sessionId, 0);
    this.activeSessions.add(sessionId);
    
    console.log(`Starting Autogen session ${sessionId} with max turns: ${actualMaxTurns}`);
    
    return {
      sessionId,
      maxTurns: actualMaxTurns
    };
  }
  
  /**
   * Record a turn in an Autogen thread
   * Returns false if max turns reached
   */
  public recordTurn(sessionId: string, maxTurns?: number): boolean {
    if (!this.activeSessions.has(sessionId)) {
      console.warn(`Attempt to record turn for unknown session: ${sessionId}`);
      return false;
    }
    
    const currentTurns = this.turnCounters.get(sessionId) || 0;
    const actualMaxTurns = maxTurns || this.defaultMaxTurns;
    
    // Increment counter
    this.turnCounters.set(sessionId, currentTurns + 1);
    
    // Check if max turns reached
    if (currentTurns + 1 >= actualMaxTurns) {
      console.log(`Autogen session ${sessionId} reached max turns: ${actualMaxTurns}`);
      this.endSession(sessionId);
      return false;
    }
    
    return true;
  }
  
  /**
   * End an Autogen thread session
   */
  public endSession(sessionId: string): void {
    this.turnCounters.delete(sessionId);
    this.activeSessions.delete(sessionId);
    console.log(`Ended Autogen session: ${sessionId}`);
  }
  
  /**
   * Get all active sessions
   */
  public getActiveSessions(): string[] {
    return Array.from(this.activeSessions);
  }
  
  /**
   * Get current turn count for a session
   */
  public getTurnCount(sessionId: string): number | undefined {
    return this.turnCounters.get(sessionId);
  }
  
  /**
   * Set default max turns for new sessions
   */
  public setDefaultMaxTurns(maxTurns: number): void {
    this.defaultMaxTurns = maxTurns;
  }
}
