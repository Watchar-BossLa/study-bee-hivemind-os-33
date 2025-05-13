
import { BrowserEventEmitter } from './BrowserEventEmitter';
import { AgentTask, TaskPriority } from '../../types/mcp';

export class TaskManager {
  private tasks: Map<string, AgentTask> = new Map();
  private emitter: BrowserEventEmitter;
  
  constructor(emitter: BrowserEventEmitter) {
    this.emitter = emitter;
  }
  
  public createTask(task: Omit<AgentTask, 'id' | 'createdAt' | 'status'>): string {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const fullTask: AgentTask = {
      ...task,
      id: taskId,
      createdAt: new Date(),
      status: 'pending'
    };
    
    this.tasks.set(taskId, fullTask);
    this.emitter.emit('task:submitted', taskId);
    
    return taskId;
  }
  
  public getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }
  
  public getPendingTasks(): AgentTask[] {
    return Array.from(this.tasks.values())
      .filter(task => task.status === 'pending')
      .sort((a, b) => b.priority - a.priority);
  }
  
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
    this.emitter.emit('task:updated', taskId, status);
    
    // Emit specific events for completed or failed tasks
    if (status === 'completed') {
      this.emitter.emit('task:completed', taskId);
    } else if (status === 'failed') {
      this.emitter.emit('task:failed', taskId);
    }
    
    return true;
  }
  
  public createTaskDAG(tasks: Array<Omit<AgentTask, 'id' | 'createdAt' | 'status'> & { dependsOn?: string[] }>): void {
    // Implementation for complex task dependency management
    console.log('Creating task DAG with', tasks.length, 'tasks');
    // DAG implementation would go here
  }
}
