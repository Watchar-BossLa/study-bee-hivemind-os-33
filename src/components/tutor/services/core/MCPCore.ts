
import { SpecializedAgent } from '../../types/agents';
import { CouncilDecision } from '../../types/councils';
import { EventEmitter } from 'events';

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  content: string;
  priority: TaskPriority;
  createdAt: Date;
  deadline?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  content: string;
  type: string;
  correlationId?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Master Control Program Core - Central orchestrator for agent coordination
 * Implements the key MCP-Core functionality outlined in the QuorumForge OS spec
 */
export class MCPCore extends EventEmitter {
  private tasks: Map<string, AgentTask> = new Map();
  private messageQueue: AgentMessage[] = [];
  private agentRegistry: Map<string, SpecializedAgent> = new Map();
  private agentStatus: Map<string, 'idle' | 'busy' | 'error'> = new Map();
  private taskPerformanceMetrics: Map<string, { avgProcessingTime: number, successRate: number }> = new Map();
  private resourceQuotas: Map<string, { maxConcurrentTasks: number, currentUsage: number }> = new Map();
  
  constructor() {
    super();
    this.setupEventListeners();
    console.log('MCP-Core initialized');
  }
  
  /**
   * Register an agent with the MCP-Core orchestrator
   * @param agent The agent to register
   */
  public registerAgent(agent: SpecializedAgent): void {
    this.agentRegistry.set(agent.id, agent);
    this.agentStatus.set(agent.id, 'idle');
    this.resourceQuotas.set(agent.id, { 
      maxConcurrentTasks: this.determineMaxConcurrentTasks(agent),
      currentUsage: 0
    });
    
    console.log(`Agent ${agent.name} (${agent.id}) registered with MCP-Core`);
    this.emit('agent:registered', agent.id);
  }
  
  /**
   * Submit a task to be processed by a specific agent
   * @param task The task to submit
   * @returns Promise that resolves with the task ID
   */
  public async submitTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const fullTask: AgentTask = {
      ...task,
      id: taskId,
      createdAt: new Date(),
      status: 'pending'
    };
    
    this.tasks.set(taskId, fullTask);
    this.emit('task:submitted', taskId);
    
    // Schedule task execution
    this.scheduleTask(fullTask);
    
    return taskId;
  }
  
  /**
   * Send a message from one agent to another
   * @param message The message to send
   */
  public sendMessage(message: Omit<AgentMessage, 'id' | 'createdAt'>): string {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const fullMessage: AgentMessage = {
      ...message,
      id: messageId,
      createdAt: new Date()
    };
    
    this.messageQueue.push(fullMessage);
    this.emit('message:sent', messageId);
    
    // Process message queue
    this.processMessageQueue();
    
    return messageId;
  }
  
  /**
   * Get the current status of an agent
   * @param agentId The agent ID
   */
  public getAgentStatus(agentId: string): 'idle' | 'busy' | 'error' | 'unknown' {
    return this.agentStatus.get(agentId) || 'unknown';
  }
  
  /**
   * Get a task by its ID
   * @param taskId The task ID
   */
  public getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }
  
  /**
   * Get all pending tasks
   */
  public getPendingTasks(): AgentTask[] {
    return Array.from(this.tasks.values())
      .filter(task => task.status === 'pending')
      .sort((a, b) => b.priority - a.priority);
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
    const task = this.tasks.get(taskId);
    
    if (!task) {
      return false;
    }
    
    const updatedTask: AgentTask = {
      ...task,
      status,
      result: result !== undefined ? result : task.result,
      error: error !== undefined ? error : task.error
    };
    
    this.tasks.set(taskId, updatedTask);
    this.emit('task:updated', taskId, status);
    
    // Update metrics if task is completed or failed
    if (status === 'completed' || status === 'failed') {
      this.updateTaskMetrics(task.agentId, status === 'completed');
      
      // Release agent resources
      const quota = this.resourceQuotas.get(task.agentId);
      if (quota) {
        quota.currentUsage = Math.max(0, quota.currentUsage - 1);
      }
    }
    
    return true;
  }
  
  /**
   * Get performance metrics for an agent
   * @param agentId The agent ID
   */
  public getAgentMetrics(agentId: string): { avgProcessingTime: number, successRate: number } | undefined {
    return this.taskPerformanceMetrics.get(agentId);
  }
  
  /**
   * Create a task DAG (Directed Acyclic Graph) for complex workflows
   * @param tasks List of tasks with dependencies
   */
  public createTaskDAG(tasks: Array<Omit<AgentTask, 'id' | 'createdAt' | 'status'> & { dependsOn?: string[] }>): void {
    // Implementation for complex task dependency management
    console.log('Creating task DAG with', tasks.length, 'tasks');
    // DAG implementation would go here
  }
  
  // Private methods
  private setupEventListeners(): void {
    this.on('task:completed', (taskId) => {
      console.log(`Task ${taskId} completed`);
      this.checkForNextTasks();
    });
    
    this.on('task:failed', (taskId) => {
      console.log(`Task ${taskId} failed`);
      this.checkForNextTasks();
    });
  }
  
  private scheduleTask(task: AgentTask): void {
    // Check if agent exists and has capacity
    const agent = this.agentRegistry.get(task.agentId);
    if (!agent) {
      this.updateTaskStatus(task.id, 'failed', undefined, 'Agent not found');
      return;
    }
    
    const quota = this.resourceQuotas.get(task.agentId);
    if (quota && quota.currentUsage >= quota.maxConcurrentTasks) {
      // Agent at capacity, will be picked up on next cycle
      console.log(`Agent ${task.agentId} at capacity, queuing task ${task.id}`);
      return;
    }
    
    // Update agent status and resource usage
    this.agentStatus.set(task.agentId, 'busy');
    if (quota) {
      quota.currentUsage++;
    }
    
    // Mark task as processing
    this.updateTaskStatus(task.id, 'processing');
    
    // Simulate task execution (in a real impl this would delegate to the agent)
    setTimeout(() => {
      console.log(`Simulated execution of task ${task.id} by agent ${task.agentId}`);
      this.updateTaskStatus(task.id, 'completed', { simulatedResult: true });
      this.agentStatus.set(task.agentId, 'idle');
    }, 1000);
  }
  
  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return;
    
    // Sort by priority (we'd add priority for messages in a real implementation)
    const message = this.messageQueue.shift();
    if (!message) return;
    
    // Check if recipient agent exists
    const recipientAgent = this.agentRegistry.get(message.toAgentId);
    if (!recipientAgent) {
      console.error(`Message ${message.id} has unknown recipient: ${message.toAgentId}`);
      return;
    }
    
    // Deliver message (in real implementation, this would call agent's handleMessage method)
    console.log(`Delivering message from ${message.fromAgentId} to ${message.toAgentId}`);
    this.emit('message:delivered', message);
  }
  
  private checkForNextTasks(): void {
    const pendingTasks = this.getPendingTasks();
    for (const task of pendingTasks) {
      this.scheduleTask(task);
    }
  }
  
  private updateTaskMetrics(agentId: string, success: boolean): void {
    const currentMetrics = this.taskPerformanceMetrics.get(agentId) || { 
      avgProcessingTime: 0, 
      successRate: 0 
    };
    
    // Simple update - in a real implementation we'd track more sophisticated metrics
    const newSuccessRate = success 
      ? (currentMetrics.successRate * 0.9) + 0.1  // Weighted towards success
      : (currentMetrics.successRate * 0.9);       // Decrease on failure
      
    this.taskPerformanceMetrics.set(agentId, {
      ...currentMetrics,
      successRate: newSuccessRate
    });
  }
  
  private determineMaxConcurrentTasks(agent: SpecializedAgent): number {
    // Simple algorithm based on agent performance
    const baseCapacity = 3;
    const performanceMultiplier = (agent.performance.accuracy + 1) / 2; // 0.5 to 1.0
    return Math.max(1, Math.round(baseCapacity * performanceMultiplier));
  }
}

// Export a singleton instance
export const mcpCore = new MCPCore();
