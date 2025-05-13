
import { BrowserEventEmitter } from './BrowserEventEmitter';
import { AgentTask } from '../../types/mcp';
import { AgentManager } from './AgentManager';
import { TaskManager } from './TaskManager';

export class TaskScheduler {
  private emitter: BrowserEventEmitter;
  private agentManager: AgentManager;
  private taskManager: TaskManager;
  
  constructor(
    emitter: BrowserEventEmitter,
    agentManager: AgentManager,
    taskManager: TaskManager
  ) {
    this.emitter = emitter;
    this.agentManager = agentManager;
    this.taskManager = taskManager;
    
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.emitter.on('task:completed', (taskId) => {
      console.log(`Task ${taskId} completed`);
      this.checkForNextTasks();
    });
    
    this.emitter.on('task:failed', (taskId) => {
      console.log(`Task ${taskId} failed`);
      this.checkForNextTasks();
    });
  }
  
  public scheduleTask(task: AgentTask): void {
    // Check if agent exists and has capacity
    const agent = this.agentManager.getAgent(task.agentId);
    if (!agent) {
      this.taskManager.updateTaskStatus(task.id, 'failed', undefined, 'Agent not found');
      return;
    }
    
    const quota = this.agentManager.getAgentQuota(task.agentId);
    if (quota && quota.currentUsage >= quota.maxConcurrentTasks) {
      // Agent at capacity, will be picked up on next cycle
      console.log(`Agent ${task.agentId} at capacity, queuing task ${task.id}`);
      return;
    }
    
    // Update agent status and resource usage
    this.agentManager.setAgentStatus(task.agentId, 'busy');
    if (quota) {
      this.agentManager.updateAgentQuota(task.agentId, (q) => ({
        ...q,
        currentUsage: q.currentUsage + 1
      }));
    }
    
    // Mark task as processing
    this.taskManager.updateTaskStatus(task.id, 'processing');
    
    // Simulate task execution (in a real impl this would delegate to the agent)
    setTimeout(() => {
      console.log(`Simulated execution of task ${task.id} by agent ${task.agentId}`);
      this.taskManager.updateTaskStatus(task.id, 'completed', { simulatedResult: true });
      this.agentManager.setAgentStatus(task.agentId, 'idle');
      
      // Update metrics
      this.agentManager.updateTaskMetrics(task.agentId, true); // Success
      
      // Release agent resources
      this.agentManager.updateAgentQuota(task.agentId, (q) => ({
        ...q,
        currentUsage: Math.max(0, q.currentUsage - 1)
      }));
    }, 1000);
  }
  
  public checkForNextTasks(): void {
    const pendingTasks = this.taskManager.getPendingTasks();
    for (const task of pendingTasks) {
      this.scheduleTask(task);
    }
  }
}
