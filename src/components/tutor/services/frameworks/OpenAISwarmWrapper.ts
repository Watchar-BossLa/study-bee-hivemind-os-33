
import { swarmMetricsService } from '../metrics/SwarmMetricsService';

/**
 * Wrapper class for OpenAI Swarm integration 
 * For implementing TSB Section 18 - Swarm parallel execution capabilities
 */
export class OpenAISwarmWrapper {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * Run a set of tasks in parallel using OpenAI Swarm
   * @param tasks Array of tasks to be executed in parallel
   * @param concurrency Optional concurrency limit
   * @param councilId Optional council ID for metrics collection
   * @param topic Optional topic for metrics collection
   * @returns Array of results corresponding to each task
   */
  async runSwarm(
    tasks: any[],
    concurrency: number = 5,
    councilId?: string,
    topic?: string
  ): Promise<string[]> {
    const startTime = Date.now();
    const agentCount = Math.min(tasks.length, concurrency);
    
    console.log(`OpenAISwarmWrapper.runSwarm: ${tasks.length} tasks with concurrency ${concurrency}`);
    
    try {
      // Simulating swarm processing - this would be replaced with actual OpenAI API call
      // This is a placeholder for the actual implementation
      await new Promise(resolve => setTimeout(resolve, 300 * tasks.length / concurrency));
      
      // Generate simulated results
      const results = tasks.map((task, index) => {
        return `Result for task ${index}: ${JSON.stringify(task).substring(0, 50)}...`;
      });
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      const estimatedTokenUsage = tasks.length * 150; // Rough estimation
      
      // Record metrics about this swarm execution
      swarmMetricsService.recordSwarmExecution(
        tasks.length,
        agentCount,
        executionTime,
        estimatedTokenUsage,
        councilId,
        topic
      );
      
      console.log(`OpenAISwarmWrapper execution completed in ${executionTime}ms`);
      
      return results;
    } catch (error) {
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Record metrics even for failed executions
      swarmMetricsService.recordSwarmExecution(
        tasks.length,
        agentCount,
        executionTime,
        0, // No tokens used for failed execution
        councilId,
        topic
      );
      
      console.error('Error in OpenAISwarmWrapper.runSwarm:', error);
      throw new Error(`OpenAI Swarm execution failed: ${(error as Error).message}`);
    }
  }
  
  /**
   * Clear accumulated metrics
   */
  clearMetrics(): void {
    swarmMetricsService.clearMetrics();
  }
}
