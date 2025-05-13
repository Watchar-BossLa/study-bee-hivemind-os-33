
import { SpecializedAgent } from '../../types/agents';
import { BrowserEventEmitter } from './BrowserEventEmitter';
import { AgentTask, AgentMessage, TaskPriority } from '../../types/mcp';
import { TaskManager } from './TaskManager';
import { AgentManager } from './AgentManager';
import { MessageManager } from './MessageManager';
import { TaskScheduler } from './TaskScheduler';

/**
 * Master Control Program Core - Central orchestrator for agent coordination
 * Implements the key MCP-Core functionality outlined in the QuorumForge OS spec
 */
export class MCPCore extends BrowserEventEmitter {
  private taskManager: TaskManager;
  private agentManager: AgentManager;
  private messageManager: MessageManager;
  private taskScheduler: TaskScheduler;
  
  constructor() {
    super();
    
    // Initialize component managers
    this.taskManager = new TaskManager(this);
    this.agentManager = new AgentManager(this);
    this.messageManager = new MessageManager(this, (agentId) => this.agentManager.getAgent(agentId));
    this.taskScheduler = new TaskScheduler(this, this.agentManager, this.taskManager);
    
    console.log('MCP-Core initialized');
  }
  
  /**
   * Register an agent with the MCP-Core orchestrator
   * @param agent The agent to register
   */
  public registerAgent(agent: SpecializedAgent): void {
    this.agentManager.registerAgent(agent);
  }
  
  /**
   * Submit a task to be processed by a specific agent
   * @param task The task to submit
   * @returns Promise that resolves with the task ID
   */
  public async submitTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const taskId = this.taskManager.createTask(task);
    
    // Schedule task execution
    const fullTask = this.taskManager.getTask(taskId);
    if (fullTask) {
      this.taskScheduler.scheduleTask(fullTask);
    }
    
    return taskId;
  }
  
  /**
   * Send a message from one agent to another
   * @param message The message to send
   */
  public sendMessage(message: Omit<AgentMessage, 'id' | 'createdAt'>): string {
    return this.messageManager.sendMessage(message);
  }
  
  /**
   * Get the current status of an agent
   * @param agentId The agent ID
   */
  public getAgentStatus(agentId: string): 'idle' | 'busy' | 'error' | 'unknown' {
    return this.agentManager.getAgentStatus(agentId);
  }
  
  /**
   * Get a task by its ID
   * @param taskId The task ID
   */
  public getTask(taskId: string): AgentTask | undefined {
    return this.taskManager.getTask(taskId);
  }
  
  /**
   * Get all pending tasks
   */
  public getPendingTasks(): AgentTask[] {
    return this.taskManager.getPendingTasks();
  }
  
  /**
   * Update a task's status and result
   * @param taskId The task ID
   * @param status The new status
   * @param result Optional result data
   * @param error Optional error message
   */
  public updateTaskStatus(
    taskId: string, 
    status: 'pending' | 'processing' | 'completed' | 'failed',
    result?: any,
    error?: string
  ): boolean {
    return this.taskManager.updateTaskStatus(taskId, status, result, error);
  }
  
  /**
   * Get performance metrics for an agent
   * @param agentId The agent ID
   */
  public getAgentMetrics(agentId: string): { avgProcessingTime: number, successRate: number } | undefined {
    return this.agentManager.getAgentMetrics(agentId);
  }
  
  /**
   * Create a task DAG (Directed Acyclic Graph) for complex workflows
   * @param tasks List of tasks with dependencies
   */
  public createTaskDAG(tasks: Array<Omit<AgentTask, 'id' | 'createdAt' | 'status'> & { dependsOn?: string[] }>): void {
    this.taskManager.createTaskDAG(tasks);
  }
}

// Re-export required types
export { TaskPriority, AgentTask, AgentMessage };

// Export a singleton instance
export const mcpCore = new MCPCore();
