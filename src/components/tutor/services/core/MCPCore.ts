
import { v4 as uuidv4 } from '@/lib/uuid';
import { RedisEventBus, redisEventBus } from './RedisEventBus';

export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Task {
  id: string;
  type: string;
  content: any;
  priority: TaskPriority;
  agentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  metadata?: Record<string, any>;
  submittedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  content: any;
  type: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'busy';
  lastHeartbeat?: Date;
}

/**
 * Master Control Program Core - Central orchestrator for agent systems
 */
export class MCPCore {
  private tasks: Map<string, Task> = new Map();
  private agents: Map<string, Agent> = new Map();
  private eventBus: RedisEventBus;
  private taskHandlers: Map<string, (task: Task) => Promise<any>> = new Map();
  private messageHandlers: Map<string, (message: Message) => void> = new Map();
  
  constructor(eventBus?: RedisEventBus) {
    this.eventBus = eventBus || redisEventBus;
    this.setupEventListeners();
    
    console.log('MCP-Core initialized');
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for task submissions from other nodes
    this.eventBus.subscribe('mcp:task:submit', (task: Task) => {
      this.tasks.set(task.id, task);
      this.processTask(task);
    });
    
    // Listen for task updates from other nodes
    this.eventBus.subscribe('mcp:task:update', (taskUpdate: { 
      id: string; 
      status: 'pending' | 'processing' | 'completed' | 'failed';
      result?: any;
      error?: string;
    }) => {
      const task = this.tasks.get(taskUpdate.id);
      if (task) {
        task.status = taskUpdate.status;
        
        if (taskUpdate.result !== undefined) {
          task.result = taskUpdate.result;
        }
        
        if (taskUpdate.error !== undefined) {
          task.error = taskUpdate.error;
        }
        
        if (task.status === 'completed' || task.status === 'failed') {
          task.completedAt = new Date();
        }
        
        this.tasks.set(task.id, task);
      }
    });
    
    // Listen for messages
    this.eventBus.subscribe('mcp:message', (message: Message) => {
      const handler = this.messageHandlers.get(message.toAgentId) || 
                      this.messageHandlers.get('*');
                      
      if (handler) {
        handler(message);
      }
    });
    
    // Listen for agent registrations
    this.eventBus.subscribe('mcp:agent:register', (agent: Agent) => {
      this.agents.set(agent.id, agent);
    });
    
    // Listen for agent heartbeats
    this.eventBus.subscribe('mcp:agent:heartbeat', (heartbeat: { agentId: string }) => {
      const agent = this.agents.get(heartbeat.agentId);
      if (agent) {
        agent.lastHeartbeat = new Date();
        agent.status = 'active';
        this.agents.set(agent.id, agent);
      }
    });
  }
  
  /**
   * Submit a task to be processed
   */
  public async submitTask(taskData: {
    type: string;
    content: any;
    agentId?: string;
    priority?: TaskPriority;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const taskId = uuidv4();
    const task: Task = {
      id: taskId,
      type: taskData.type,
      content: taskData.content,
      priority: taskData.priority || 'normal',
      agentId: taskData.agentId,
      status: 'pending',
      metadata: taskData.metadata,
      submittedAt: new Date()
    };
    
    this.tasks.set(taskId, task);
    
    // Publish the task to the event bus
    await this.eventBus.publish('mcp:task:submit', task);
    
    // Process the task locally as well
    this.processTask(task);
    
    return taskId;
  }
  
  /**
   * Process a task
   */
  private async processTask(task: Task): Promise<void> {
    const handler = this.taskHandlers.get(task.type);
    if (!handler) {
      return; // No handler for this task type
    }
    
    // Update task status to processing
    task.status = 'processing';
    task.startedAt = new Date();
    this.tasks.set(task.id, task);
    await this.eventBus.publish('mcp:task:update', { 
      id: task.id, 
      status: task.status 
    });
    
    try {
      // Execute the handler
      const result = await handler(task);
      
      // Update task with result
      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date();
      this.tasks.set(task.id, task);
      
      await this.eventBus.publish('mcp:task:update', { 
        id: task.id, 
        status: task.status,
        result
      });
    } catch (error) {
      // Update task with error
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);
      task.completedAt = new Date();
      this.tasks.set(task.id, task);
      
      await this.eventBus.publish('mcp:task:update', { 
        id: task.id, 
        status: task.status,
        error: task.error
      });
    }
  }
  
  /**
   * Register a task handler
   */
  public registerTaskHandler(
    taskType: string, 
    handler: (task: Task) => Promise<any>
  ): void {
    this.taskHandlers.set(taskType, handler);
  }
  
  /**
   * Send a message between agents
   */
  public async sendMessage(messageData: {
    fromAgentId: string;
    toAgentId: string;
    content: any;
    type: string;
    metadata?: Record<string, any>;
  }): Promise<string> {
    const messageId = uuidv4();
    const message: Message = {
      id: messageId,
      fromAgentId: messageData.fromAgentId,
      toAgentId: messageData.toAgentId,
      content: messageData.content,
      type: messageData.type,
      metadata: messageData.metadata,
      timestamp: new Date()
    };
    
    // Publish the message to the event bus
    await this.eventBus.publish('mcp:message', message);
    
    // Process message locally as well
    const handler = this.messageHandlers.get(message.toAgentId) || 
                    this.messageHandlers.get('*');
                    
    if (handler) {
      handler(message);
    }
    
    return messageId;
  }
  
  /**
   * Register a message handler
   */
  public registerMessageHandler(
    agentId: string | '*', 
    handler: (message: Message) => void
  ): void {
    this.messageHandlers.set(agentId, handler);
  }
  
  /**
   * Register an agent
   */
  public registerAgent(agent: {
    id: string;
    name: string;
    type?: string;
    capabilities?: string[];
  }): void {
    const agentRecord: Agent = {
      id: agent.id,
      name: agent.name,
      type: agent.type || 'generic',
      capabilities: agent.capabilities || [],
      status: 'active',
      lastHeartbeat: new Date()
    };
    
    this.agents.set(agent.id, agentRecord);
    
    // Publish the agent registration to the event bus
    this.eventBus.publish('mcp:agent:register', agentRecord).catch(err => {
      console.error('Error publishing agent registration:', err);
    });
    
    console.log(`Agent ${agent.name} (${agent.id}) registered with MCP-Core`);
  }
  
  /**
   * Send a heartbeat for an agent
   */
  public async sendAgentHeartbeat(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    
    agent.lastHeartbeat = new Date();
    agent.status = 'active';
    this.agents.set(agentId, agent);
    
    // Publish the heartbeat to the event bus
    await this.eventBus.publish('mcp:agent:heartbeat', { agentId });
  }
  
  /**
   * Get a task by ID
   */
  public getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }
  
  /**
   * Get an agent by ID
   */
  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }
  
  /**
   * Get all agents
   */
  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Get all tasks
   */
  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
  
  /**
   * Wait for a task to complete
   */
  public async waitForTaskCompletion(taskId: string, timeoutMs: number = 30000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const task = this.tasks.get(taskId);
      
      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }
      
      if (task.status === 'completed') {
        return task.result;
      }
      
      if (task.status === 'failed') {
        throw new Error(task.error || 'Task failed');
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Task ${taskId} timed out after ${timeoutMs}ms`);
  }
  
  /**
   * Get the event bus
   */
  public getEventBus(): RedisEventBus {
    return this.eventBus;
  }
}

// Export a singleton instance
export const mcpCore = new MCPCore();
