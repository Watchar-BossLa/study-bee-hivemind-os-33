
import { LLMRouter } from '../LLMRouter';

export interface Agent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  capabilities: string[];
  llmModel: string;
}

export interface Task {
  id: string;
  description: string;
  agent: Agent;
  dependencies: string[];
  expectedOutput: string;
  tools: string[];
}

export interface Crew {
  id: string;
  name: string;
  agents: Agent[];
  tasks: Task[];
  process: 'sequential' | 'hierarchical';
  manager?: Agent;
}

/**
 * CrewAI Integration for multi-agent coordination and task execution
 */
export class CrewAI {
  private llmRouter: LLMRouter;
  private crews: Map<string, Crew> = new Map();
  private activeExecutions: Map<string, any> = new Map();
  
  constructor(llmRouter: LLMRouter) {
    this.llmRouter = llmRouter;
  }
  
  /**
   * Create a new agent
   */
  public createAgent(config: Omit<Agent, 'id'>): Agent {
    const agent: Agent = {
      id: `agent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...config
    };
    
    console.log(`Created CrewAI agent: ${agent.id} (${agent.role})`);
    return agent;
  }
  
  /**
   * Create a new task
   */
  public createTask(config: Omit<Task, 'id'>): Task {
    const task: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...config
    };
    
    console.log(`Created CrewAI task: ${task.id}`);
    return task;
  }
  
  /**
   * Create a new crew
   */
  public createCrew(config: Omit<Crew, 'id'>): Crew {
    const crew: Crew = {
      id: `crew-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ...config
    };
    
    this.crews.set(crew.id, crew);
    
    console.log(`Created CrewAI crew: ${crew.id} with ${crew.agents.length} agents and ${crew.tasks.length} tasks`);
    return crew;
  }
  
  /**
   * Execute a crew's tasks
   */
  public async kickoff(crewId: string, inputs?: Record<string, any>): Promise<{
    success: boolean;
    results: Array<{
      taskId: string;
      result: string;
      agentId: string;
      executionTime: number;
    }>;
    totalTime: number;
    errors?: string[];
  }> {
    const crew = this.crews.get(crewId);
    if (!crew) {
      throw new Error(`Crew not found: ${crewId}`);
    }
    
    console.log(`Starting CrewAI execution for crew: ${crewId}`);
    
    const startTime = Date.now();
    const results: any[] = [];
    const errors: string[] = [];
    
    this.activeExecutions.set(crewId, {
      startTime,
      status: 'running'
    });
    
    try {
      if (crew.process === 'sequential') {
        // Execute tasks sequentially
        for (const task of crew.tasks) {
          const taskResult = await this.executeTask(task, inputs);
          results.push(taskResult);
          
          if (!taskResult.success) {
            errors.push(`Task ${task.id} failed: ${taskResult.error}`);
          }
        }
      } else if (crew.process === 'hierarchical') {
        // Execute tasks with hierarchical coordination
        const taskResults = await this.executeHierarchicalTasks(crew, inputs);
        results.push(...taskResults);
      }
      
      const totalTime = Date.now() - startTime;
      
      this.activeExecutions.set(crewId, {
        startTime,
        status: 'completed',
        totalTime
      });
      
      return {
        success: errors.length === 0,
        results,
        totalTime,
        errors: errors.length > 0 ? errors : undefined
      };
      
    } catch (error) {
      const totalTime = Date.now() - startTime;
      
      this.activeExecutions.set(crewId, {
        startTime,
        status: 'failed',
        totalTime,
        error: (error as Error).message
      });
      
      throw error;
    }
  }
  
  /**
   * Execute a single task
   */
  private async executeTask(task: Task, inputs?: Record<string, any>): Promise<{
    taskId: string;
    result: string;
    agentId: string;
    executionTime: number;
    success: boolean;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      console.log(`Executing task ${task.id} with agent ${task.agent.id}`);
      
      // Prepare context for the agent
      const context = {
        task: task.description,
        role: task.agent.role,
        goal: task.agent.goal,
        backstory: task.agent.backstory,
        expectedOutput: task.expectedOutput,
        inputs: inputs || {}
      };
      
      // Use LLM Router to get response
      const model = this.llmRouter.selectModel({
        promptTokens: 500,
        maxTokens: 1000,
        priority: 'medium',
        useCase: 'agent_task'
      });
      
      // Simulate task execution
      const prompt = `
        You are ${task.agent.name}, a ${task.agent.role}.
        
        Background: ${task.agent.backstory}
        Goal: ${task.agent.goal}
        
        Task: ${task.description}
        Expected Output: ${task.expectedOutput}
        
        Additional Context: ${JSON.stringify(context.inputs)}
        
        Please complete this task according to your role and goal.
      `;
      
      // In a real implementation, this would call the actual LLM
      const result = `Task completed by ${task.agent.name}: ${task.description}`;
      
      const executionTime = Date.now() - startTime;
      
      return {
        taskId: task.id,
        result,
        agentId: task.agent.id,
        executionTime,
        success: true
      };
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      return {
        taskId: task.id,
        result: '',
        agentId: task.agent.id,
        executionTime,
        success: false,
        error: (error as Error).message
      };
    }
  }
  
  /**
   * Execute tasks in hierarchical mode
   */
  private async executeHierarchicalTasks(crew: Crew, inputs?: Record<string, any>): Promise<any[]> {
    if (!crew.manager) {
      throw new Error('Hierarchical process requires a manager agent');
    }
    
    console.log(`Executing hierarchical tasks with manager: ${crew.manager.id}`);
    
    // Manager coordinates task execution
    const results: any[] = [];
    
    // Sort tasks by dependencies
    const sortedTasks = this.sortTasksByDependencies(crew.tasks);
    
    for (const task of sortedTasks) {
      // Manager assigns task to appropriate agent
      const assignedAgent = this.assignTaskToAgent(task, crew.agents);
      
      const taskWithAgent = { ...task, agent: assignedAgent };
      const result = await this.executeTask(taskWithAgent, inputs);
      
      results.push(result);
      
      // Update inputs with task results for dependent tasks
      if (inputs) {
        inputs[`task_${task.id}_result`] = result.result;
      }
    }
    
    return results;
  }
  
  /**
   * Sort tasks by their dependencies
   */
  private sortTasksByDependencies(tasks: Task[]): Task[] {
    const sorted: Task[] = [];
    const visited = new Set<string>();
    
    const visit = (task: Task) => {
      if (visited.has(task.id)) {
        return;
      }
      
      // Visit dependencies first
      for (const depId of task.dependencies) {
        const depTask = tasks.find(t => t.id === depId);
        if (depTask && !visited.has(depId)) {
          visit(depTask);
        }
      }
      
      visited.add(task.id);
      sorted.push(task);
    };
    
    for (const task of tasks) {
      visit(task);
    }
    
    return sorted;
  }
  
  /**
   * Assign task to the most suitable agent
   */
  private assignTaskToAgent(task: Task, agents: Agent[]): Agent {
    // Simple assignment based on capabilities
    for (const agent of agents) {
      if (agent.capabilities.some(cap => task.tools.includes(cap))) {
        return agent;
      }
    }
    
    // Default to first agent if no specific match
    return agents[0];
  }
  
  /**
   * Get crew execution status
   */
  public getExecutionStatus(crewId: string): any {
    return this.activeExecutions.get(crewId);
  }
  
  /**
   * Stop crew execution
   */
  public stopExecution(crewId: string): boolean {
    const execution = this.activeExecutions.get(crewId);
    if (execution && execution.status === 'running') {
      execution.status = 'stopped';
      return true;
    }
    return false;
  }
}
