
import { LLMRouter } from '../LLMRouter';
import { AutogenTurnGuard } from './AutogenTurnGuard';

export class AutogenIntegration {
  private router: LLMRouter;
  private turnGuard?: AutogenTurnGuard;
  
  constructor(router: LLMRouter, turnGuard?: AutogenTurnGuard) {
    this.router = router;
    this.turnGuard = turnGuard;
    console.log('Autogen Integration initialized for agent conversations');
  }
  
  public createThread(agents: string[], topic: string): { threadId: string, maxTurns?: number } {
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    let maxTurns: number | undefined;
    
    // Register session with turn guard if available
    if (this.turnGuard) {
      const session = this.turnGuard.startSession(threadId);
      maxTurns = session.maxTurns;
    }
    
    console.log(`Created Autogen thread ${threadId} with agents: ${agents.join(', ')}`);
    
    return {
      threadId,
      maxTurns
    };
  }
  
  public async processTurn(
    threadId: string,
    fromAgent: string, 
    message: string
  ): Promise<{ toAgent: string, response: string, isFinalTurn: boolean }> {
    // Check if turn is allowed with turn guard
    let isFinalTurn = false;
    if (this.turnGuard) {
      const canContinue = this.turnGuard.recordTurn(threadId);
      isFinalTurn = !canContinue;
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate response
    const toAgent = fromAgent === 'user' ? 'assistant' : 'user';
    const response = `Response from ${toAgent} in thread ${threadId}: ${message.substring(0, 30)}...`;
    
    console.log(`Processed turn in thread ${threadId}: ${fromAgent} -> ${toAgent}`);
    
    return {
      toAgent,
      response,
      isFinalTurn
    };
  }
  
  public endThread(threadId: string): void {
    console.log(`Ending Autogen thread: ${threadId}`);
    if (this.turnGuard) {
      this.turnGuard.endSession(threadId);
    }
  }
}
