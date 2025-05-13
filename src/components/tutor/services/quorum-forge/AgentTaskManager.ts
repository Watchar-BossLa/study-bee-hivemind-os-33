
import { MCPCore, TaskPriority, AgentTask } from '../core/MCPCore';

/**
 * Manages agent tasks in QuorumForge
 */
export class AgentTaskManager {
  private mcpCore: MCPCore;
  
  constructor(mcpCore: MCPCore) {
    this.mcpCore = mcpCore;
  }
  
  /**
   * Submit a task to be processed by a specific agent
   * @param agentId The agent to process the task
   * @param taskType The type of task
   * @param content The task content
   * @param priority Task priority
   */
  public async submitAgentTask(
    agentId: string,
    taskType: string,
    content: any,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): Promise<string> {
    const priorityMap: Record<string, TaskPriority> = {
      'low': TaskPriority.LOW,
      'normal': TaskPriority.NORMAL,
      'high': TaskPriority.HIGH,
      'critical': TaskPriority.CRITICAL
    };
    
    return this.mcpCore.submitTask({
      agentId,
      type: taskType,
      content,
      priority: priorityMap[priority]
    });
  }
  
  /**
   * Get the status of a task
   * @param taskId The task ID
   */
  public getTaskStatus(taskId: string): { status: string; result?: any } {
    const task = this.mcpCore.getTask(taskId);
    
    if (!task) {
      return { status: 'unknown' };
    }
    
    return {
      status: task.status,
      result: task.result
    };
  }
}
