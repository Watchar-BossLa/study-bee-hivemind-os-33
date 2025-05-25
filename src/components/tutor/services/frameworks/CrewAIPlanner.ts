
import { Plan } from '../deliberation/types/voting-types';
import { v4 as uuidv4 } from 'uuid';

export class CrewAIPlanner {
  constructor() {
  }

  public async createPlan(
    goal: string,
    context: Record<string, any> = {},
    agents: string[] = []
  ): Promise<Plan> {
    const planId = uuidv4();
    const tasks = [
      {
        id: uuidv4(),
        description: `Research the goal: ${goal}`,
        assignedTo: agents[0] || 'researcher'
      },
      {
        id: uuidv4(),
        description: `Analyze the research and create a plan of action for: ${goal}`,
        assignedTo: agents[1] || 'analyzer'
      },
      {
        id: uuidv4(),
        description: `Execute the plan of action for: ${goal}`,
        assignedTo: agents[2] || 'executor'
      }
    ];

    try {
      const plan: Plan = {
        id: planId,
        planId: planId, // For backward compatibility
        title: `CrewAI plan for: ${goal}`,
        type: 'crew_ai_plan',
        summary: `CrewAI plan for: ${goal}`,
        tasks: tasks.map(task => ({
          id: task.id,
          taskId: task.id, // For backward compatibility
          description: task.description,
          priority: 3
        })),
        memberCount: agents.length,
        members: agents
      };

      return plan;
    } catch (error) {
      const errorPlan: Plan = {
        id: planId,
        planId: planId, // For backward compatibility
        title: `Failed plan for: ${goal}`,
        type: 'crew_ai_plan',
        summary: `Failed plan for: ${goal}`,
        tasks: [{
          id: 'error-task',
          taskId: 'error-task', // For backward compatibility
          description: `Plan creation failed: ${error}`,
          priority: 5
        }],
        memberCount: 0,
        members: []
      };
      
      return errorPlan;
    }
  }

  public async executePlan(plan: Plan): Promise<{ result: string; metadata: Record<string, any> }> {
    return {
      result: `Executed plan: ${plan.title}`,
      metadata: {
        planId: plan.id,
        tasksCompleted: plan.tasks.length,
        executionTime: Date.now()
      }
    };
  }
}

// Use export type instead of re-export for isolatedModules
export type { Plan };
