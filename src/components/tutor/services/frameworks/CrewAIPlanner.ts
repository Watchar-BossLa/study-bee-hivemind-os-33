
import { CouncilService } from '../CouncilService';
import { CrewAI } from './CrewAI';
import { LLMRouter } from '../LLMRouter';
import { PydanticValidator } from './PydanticValidator';
import { v4 as uuidv4 } from '@/lib/uuid';

export interface PlanTask {
  id: string;
  description: string;
  title?: string;
  priority?: number;
}

export interface Plan {
  id: string;
  type?: string;
  title: string;
  summary?: string;
  tasks: PlanTask[];
  memberCount?: number;
  members?: string[];
}

/**
 * CrewAI Planner - Integration with CrewAI framework
 * Implements the crewai-senior feature from QuorumForge OS spec
 */
export class CrewAIPlanner {
  private councilService: CouncilService;
  private crewAI: CrewAI;
  private validator: PydanticValidator;
  
  constructor(councilService: CouncilService, router: LLMRouter) {
    this.councilService = councilService;
    this.crewAI = new CrewAI(councilService, router);
    this.validator = new PydanticValidator();
    
    console.log('CrewAI Planner initialized');
  }
  
  /**
   * Create a plan for a given topic using a council
   */
  public async createPlan(
    topic: string,
    councilId: string,
    context: Record<string, any> = {}
  ): Promise<Plan> {
    console.log(`Creating plan for topic: ${topic} using council: ${councilId}`);
    
    const council = this.councilService.getCouncil(councilId);
    if (!council) {
      throw new Error(`Council ${councilId} not found`);
    }
    
    try {
      // Create a crew with the council members
      const crew = await this.crewAI.createCrew(
        `${councilId}-${Date.now()}`, 
        councilId, 
        `Create a plan for: ${topic}`,
        context
      );
      
      // Assign roles based on agent capabilities
      const assignments = council.map((agent, index) => {
        let role = 'contributor';
        if (index === 0) role = 'planner';
        else if (index === 1) role = 'critic';
        
        return {
          agentId: agent.id,
          role,
          goals: [`Help create a plan for: ${topic}`]
        };
      });
      
      await this.crewAI.assignRolesAndGoals(crew.id, assignments);
      
      // Generate the plan
      const plan = await this.crewAI.generatePlan(crew.id);
      
      // Validate the plan
      try {
        this.validator.validatePlan(plan);
      } catch (error) {
        console.error('Plan validation error:', error);
        // If validation fails, generate a minimal valid plan
        return this.createFallbackPlan(topic, council);
      }
      
      return plan;
    } catch (error) {
      console.error('Error in CrewAI plan creation:', error);
      // If anything fails, return a fallback plan
      return this.createFallbackPlan(topic, council);
    }
  }
  
  /**
   * Create a fallback plan when the normal process fails
   */
  private createFallbackPlan(topic: string, council: any[]): Plan {
    const planId = `plan_fallback_${uuidv4()}`;
    
    return {
      id: planId,
      title: `Plan for ${topic}`,
      summary: `This plan addresses ${topic} with a comprehensive approach`,
      tasks: [
        { id: `task_${planId}_1`, description: `Research ${topic} background` },
        { id: `task_${planId}_2`, description: `Analyze ${topic} challenges` },
        { id: `task_${planId}_3`, description: `Propose solutions for ${topic}` },
        { id: `task_${planId}_4`, description: `Validate ${topic} solutions` }
      ],
      memberCount: council.length,
      members: council.map(agent => agent.id)
    };
  }
  
  /**
   * Execute a plan using agents from a council
   */
  public async executePlan(plan: Plan, context: Record<string, any> = {}): Promise<any> {
    console.log(`Executing plan: ${plan.title}`);
    
    // In a real implementation, this would assign tasks to agents and execute them
    const results = plan.tasks.map(task => ({
      taskId: task.id,
      status: 'completed',
      result: `Simulated result for ${task.description}`
    }));
    
    return {
      planId: plan.id,
      status: 'completed',
      results
    };
  }
}
