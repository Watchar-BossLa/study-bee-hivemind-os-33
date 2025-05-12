
import { Plan } from './types/votingTypes';

export class PlanVoter {
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
  
  public getLatestVoteTrends(): Map<string, { up: number; down: number }> {
    const trends = new Map<string, { up: number; down: number }>();
    
    // Simulate trends calculation
    trends.set('risk_assessment', { up: 7, down: 2 });
    trends.set('efficiency', { up: 5, down: 4 });
    trends.set('creativity', { up: 9, down: 1 });
    
    return trends;
  }
}
