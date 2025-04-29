
import { SpecializedAgent } from '../../types/agents';
import { CouncilService } from '../CouncilService';

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  expertise: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo?: string;
  dependencies?: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Plan {
  id: string;
  title: string;
  tasks: Task[];
  members: CrewMember[];
  createdAt: Date;
}

export class CrewAIPlanner {
  private councilService: CouncilService;
  private plans: Map<string, Plan> = new Map();
  
  constructor(councilService: CouncilService) {
    this.councilService = councilService;
    console.log('CrewAI Planner initialized for role+goal planning');
  }
  
  public async createPlan(
    topic: string,
    agents: SpecializedAgent[],
    context: Record<string, any>
  ): Promise<Plan> {
    // Create crew members from agents
    const members = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      expertise: agent.expertise
    }));
    
    // Create plan with tasks based on agent specializations
    const plan: Plan = {
      id: `plan-${Date.now()}`,
      title: `Plan for: ${topic}`,
      tasks: this.generateTasks(topic, members, context),
      members,
      createdAt: new Date()
    };
    
    // Store the plan
    this.plans.set(plan.id, plan);
    
    // Simulate planning process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return plan;
  }
  
  private generateTasks(
    topic: string, 
    members: CrewMember[], 
    context: Record<string, any>
  ): Task[] {
    // Generic task generation based on crew member roles
    const tasks: Task[] = [];
    
    // Research & analysis tasks
    const contentExperts = members.filter(m => m.role.toLowerCase().includes('expert') || m.role.toLowerCase().includes('specialist'));
    if (contentExperts.length > 0) {
      tasks.push({
        id: `task-analysis-${Date.now()}`,
        title: 'Initial Content Analysis',
        description: `Analyze the core concepts related to "${topic}" for ${context.userSkillLevel || 'intermediate'} level`,
        assignedTo: contentExperts[0].id,
        status: 'pending'
      });
    }
    
    // Learning strategy tasks
    const strategists = members.filter(m => m.role.toLowerCase().includes('strategist') || m.role.toLowerCase().includes('coach'));
    if (strategists.length > 0) {
      tasks.push({
        id: `task-strategy-${Date.now()}`,
        title: 'Learning Path Development',
        description: `Create an optimal learning strategy for "${topic}" based on content analysis`,
        dependencies: tasks.length > 0 ? [tasks[0].id] : undefined,
        assignedTo: strategists[0].id,
        status: 'pending'
      });
    }
    
    // Engagement tasks
    const engagementSpecialists = members.filter(m => m.role.toLowerCase().includes('engagement'));
    if (engagementSpecialists.length > 0) {
      tasks.push({
        id: `task-engagement-${Date.now()}`,
        title: 'Engagement Optimization',
        description: `Develop methods to increase user engagement with "${topic}" content`,
        assignedTo: engagementSpecialists[0].id,
        status: 'pending'
      });
    }
    
    // Assessment tasks
    const assessmentExperts = members.filter(m => m.role.toLowerCase().includes('assessment'));
    if (assessmentExperts.length > 0) {
      tasks.push({
        id: `task-assessment-${Date.now()}`,
        title: 'Knowledge Assessment Design',
        description: `Create assessment strategy for "${topic}" at ${context.userSkillLevel || 'intermediate'} level`,
        assignedTo: assessmentExperts[0].id,
        status: 'pending'
      });
    }
    
    // Add integration task if multiple specialists
    if (tasks.length > 2) {
      tasks.push({
        id: `task-integration-${Date.now()}`,
        title: 'Plan Integration',
        description: 'Integrate all task outputs into a cohesive learning experience',
        dependencies: tasks.map(t => t.id),
        assignedTo: members[0].id,
        status: 'pending'
      });
    }
    
    return tasks;
  }
  
  public getPlan(planId: string): Plan | undefined {
    return this.plans.get(planId);
  }
  
  public getAllPlans(): Plan[] {
    return Array.from(this.plans.values());
  }
  
  public async updateTaskStatus(planId: string, taskId: string, status: 'pending' | 'in-progress' | 'completed'): Promise<void> {
    const plan = this.plans.get(planId);
    if (!plan) return;
    
    const task = plan.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
    }
  }
}
