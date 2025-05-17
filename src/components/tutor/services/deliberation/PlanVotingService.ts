
import { Plan } from './types/voting-types';

export class PlanVotingService {
  public voteOnPlan(plan: Plan, agentId: string, approve: boolean, reason: string): void {
    console.log(`Agent ${agentId} voted ${approve ? 'to approve' : 'to reject'} plan ${plan.planId}`);
    console.log(`Reason: ${reason}`);
    
    // If approved and there are tasks, assign them
    if (approve && plan.tasks && plan.tasks.length > 0) {
      plan.tasks.forEach(task => {
        if (!task.assignedAgentId) {
          task.assignedAgentId = agentId;
          console.log(`Task ${task.taskId} assigned to agent ${agentId}`);
        }
      });
    }
  }
}
