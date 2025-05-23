
import { LLMRouter } from '../LLMRouter';

/**
 * OpenAISwarmWrapper - Implements the swarm-wrapper feature from QuorumForge OS spec
 * Provides parallel execution functionality for OpenAI tasks
 */
export class OpenAISwarmWrapper {
  private llmRouter: LLMRouter;
  private concurrencyLimit: number = 5;
  
  constructor(llmRouter: LLMRouter) {
    this.llmRouter = llmRouter;
  }
  
  /**
   * Execute multiple tasks in parallel using a fan-out pattern
   * @param tasks Array of tasks to execute
   * @param context Additional context for execution
   * @returns Array of results
   */
  public async executeTasks(tasks: any[], context: Record<string, any> = {}): Promise<any[]> {
    console.log(`Executing ${tasks.length} tasks in parallel with OpenAI Swarm`);
    
    // Implement batching to respect concurrency limits
    const results: any[] = [];
    const batches = this.createBatches(tasks, this.concurrencyLimit);
    
    for (const batch of batches) {
      const batchPromises = batch.map(task => this.executeTask(task, context));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    console.log(`Completed ${results.length} tasks with OpenAI Swarm`);
    
    // Record metrics if available
    this.recordSwarmMetrics(tasks.length, results);
    
    return results;
  }
  
  /**
   * Alias for executeTasks to maintain compatibility with previous code
   */
  public async runTasks(tasks: any[], context: Record<string, any> = {}): Promise<any[]> {
    return this.executeTasks(tasks, context);
  }
  
  /**
   * Execute a single task using the appropriate model
   */
  private async executeTask(task: any, context: Record<string, any>): Promise<any> {
    // Create a router request for this task
    const routerRequest = {
      query: task.prompt || task.query || JSON.stringify(task),
      task: task.type || 'default',
      complexity: task.complexity || 'medium',
      urgency: task.urgency || 'medium',
      costSensitivity: task.costSensitivity || 'medium'
    };
    
    // Get the model selection
    const model = this.llmRouter.selectModel(routerRequest);
    
    // Simulate executing the task with the selected model
    // In a real implementation, this would call the model's API
    const startTime = Date.now();
    
    // Simulate processing time based on model latency
    let delay = 500;
    if (model.latency === 'medium') delay = 1000;
    if (model.latency === 'high') delay = 2000;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate a response
    const response = {
      taskId: task.id || `task-${Math.random().toString(36).substring(2, 11)}`,
      result: `Result for task: ${JSON.stringify(task).substring(0, 50)}...`,
      model: model.id,
      processingTimeMs: Date.now() - startTime
    };
    
    // Log the completion
    console.log(`Completed task ${response.taskId} using model ${model.id} in ${response.processingTimeMs}ms`);
    
    return response;
  }
  
  /**
   * Split tasks into batches to respect concurrency limits
   */
  private createBatches(tasks: any[], batchSize: number): any[][] {
    const batches: any[][] = [];
    for (let i = 0; i < tasks.length; i += batchSize) {
      batches.push(tasks.slice(i, i + batchSize));
    }
    return batches;
  }
  
  /**
   * Get the current concurrency limit
   */
  public getConcurrencyLimit(): number {
    return this.concurrencyLimit;
  }
  
  /**
   * Set the concurrency limit
   */
  public setConcurrencyLimit(limit: number): void {
    if (limit < 1) {
      throw new Error("Concurrency limit must be at least 1");
    }
    this.concurrencyLimit = limit;
  }
  
  /**
   * Record metrics about the swarm execution
   */
  private recordSwarmMetrics(tasksCount: number, results: any[]): void {
    // Calculate completion time statistics
    const completionTimes = results
      .filter(r => r.processingTimeMs)
      .map(r => r.processingTimeMs);
    
    if (completionTimes.length === 0) return;
    
    const avgCompletionTime = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
    const minCompletionTime = Math.min(...completionTimes);
    const maxCompletionTime = Math.max(...completionTimes);
    
    // Log metrics
    console.log(`Swarm metrics - Tasks: ${tasksCount}, Avg time: ${avgCompletionTime.toFixed(2)}ms, Min: ${minCompletionTime}ms, Max: ${maxCompletionTime}ms`);
  }
}
