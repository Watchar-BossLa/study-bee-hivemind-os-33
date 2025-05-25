import { Plan } from './PydanticSchemaModels';
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
        planId: planId,
        type: 'crew_ai_plan',
        summary: `CrewAI plan for: ${goal}`,
        tasks: tasks.map(task => ({
          taskId: task.id,
          description: task.description,
          status: 'completed' as 'completed' | 'in-progress' | 'draft' | 'approved' | 'rejected',
          assignedAgentId: task.assignedTo
        })),
        memberCount: agents.length,
        members: agents.map(agentId => ({
          id: agentId,
          name: `Agent-${agentId}`,
          role: 'crew_member'
        }))
      };

      return plan;
    } catch (error) {
      const errorPlan: Plan = {
        planId: planId,
        type: 'crew_ai_plan',
        summary: `Failed plan for: ${goal}`,
        tasks: [{
          taskId: 'error-task',
          description: `Plan creation failed: ${error}`,
          status: 'completed' as 'completed' | 'in-progress' | 'draft' | 'approved' | 'rejected'
        }],
        memberCount: 0,
        members: []
      };
      
      return errorPlan;
    }
  }
}
