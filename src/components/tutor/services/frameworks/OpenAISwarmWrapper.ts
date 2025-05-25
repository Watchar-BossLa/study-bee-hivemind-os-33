
import { LLMRouter } from '../LLMRouter';
import { RouterRequest } from '../../types/router';

export interface SwarmTask {
  task: string;
  agents: any[];
  priority?: 'low' | 'normal' | 'high';
}

export interface SwarmResult {
  taskId: string;
  results: any[];
  executionTime: number;
  modelUsed: string;
  fanoutRatio: number;
}

export class OpenAISwarmWrapper {
  private router: LLMRouter;
  private activeSwarms: Map<string, SwarmTask[]> = new Map();

  constructor(router: LLMRouter) {
    this.router = router;
  }

  public async executeTasks(tasks: SwarmTask[]): Promise<SwarmResult[]> {
    const swarmId = `swarm_${Date.now()}`;
    this.activeSwarms.set(swarmId, tasks);

    try {
      const results = await Promise.all(
        tasks.map(async (task, index) => {
          const request: RouterRequest = {
            query: task.task,
            task: 'tutor',
            complexity: 'medium',
            urgency: task.priority === 'high' ? 'high' : 'medium',
            costSensitivity: 'medium'
          };

          const startTime = Date.now();
          const modelSelection = await this.router.selectModel(request);
          const executionTime = Date.now() - startTime;

          return {
            taskId: `${swarmId}_task_${index}`,
            results: [{
              task: task.task,
              response: `Swarm execution result for: ${task.task}`,
              agentCount: task.agents.length
            }],
            executionTime,
            modelUsed: modelSelection.modelId,
            fanoutRatio: task.agents.length / tasks.length
          };
        })
      );

      return results;
    } finally {
      this.activeSwarms.delete(swarmId);
    }
  }

  public async run_swarm(tasks: SwarmTask[]): Promise<any[]> {
    const results = await this.executeTasks(tasks);
    return results.map(result => result.results).flat();
  }

  public getActiveSwarms(): Map<string, SwarmTask[]> {
    return new Map(this.activeSwarms);
  }

  public getSwarmMetrics(): any {
    return {
      activeSwarms: this.activeSwarms.size,
      totalTasks: Array.from(this.activeSwarms.values()).reduce(
        (sum, tasks) => sum + tasks.length, 0
      )
    };
  }
}
