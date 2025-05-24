
import { CouncilService } from '../CouncilService';

export interface PlanTask {
  id: string;
  title: string;
  description: string;
  priority: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  estimatedTime: number;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  tasks: PlanTask[];
  status: 'draft' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
  createdBy: string;
}

/**
 * CrewAI Planner for SeniorManagerGPT - Creates and manages execution plans
 */
export class CrewAIPlanner {
  private councilService: CouncilService;
  private plans: Map<string, Plan> = new Map();
  
  constructor(councilService: CouncilService) {
    this.councilService = councilService;
  }
  
  /**
   * Create a comprehensive plan for a given topic and council
   */
  public async createPlan(
    topic: string, 
    councilId: string, 
    context: Record<string, any> = {}
  ): Promise<Plan> {
    console.log(`CrewAI Planner creating plan for topic: ${topic}, council: ${councilId}`);
    
    // Analyze the topic and context to determine plan structure
    const analysis = await this.analyzeTopic(topic, context);
    
    // Generate tasks based on analysis
    const tasks = await this.generateTasks(analysis, councilId);
    
    // Create the plan
    const plan: Plan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: `Action Plan: ${topic}`,
      description: `Comprehensive plan for addressing ${topic} with ${tasks.length} tasks`,
      tasks,
      status: 'draft',
      createdAt: new Date(),
      createdBy: 'crewai-planner'
    };
    
    this.plans.set(plan.id, plan);
    
    console.log(`Created plan ${plan.id} with ${tasks.length} tasks`);
    return plan;
  }
  
  /**
   * Execute a plan using the CrewAI framework
   */
  public async executePlan(
    plan: Plan, 
    context: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    executedTasks: Array<{
      taskId: string;
      result: string;
      success: boolean;
      executionTime: number;
    }>;
    totalTime: number;
    failureReason?: string;
  }> {
    console.log(`CrewAI Planner executing plan: ${plan.id}`);
    
    const startTime = Date.now();
    const executedTasks: Array<{
      taskId: string;
      result: string;
      success: boolean;
      executionTime: number;
    }> = [];
    
    let success = true;
    let failureReason: string | undefined;
    
    try {
      // Update plan status
      plan.status = 'in-progress';
      this.plans.set(plan.id, plan);
      
      // Execute tasks in priority order
      const sortedTasks = [...plan.tasks].sort((a, b) => a.priority - b.priority);
      
      for (const task of sortedTasks) {
        const taskStartTime = Date.now();
        
        try {
          // Execute the task
          const result = await this.executeTask(task, context);
          
          const executionTime = Date.now() - taskStartTime;
          
          executedTasks.push({
            taskId: task.id,
            result: result.output,
            success: result.success,
            executionTime
          });
          
          // Update task status
          task.status = result.success ? 'completed' : 'failed';
          
          if (!result.success) {
            success = false;
            failureReason = `Task ${task.id} failed: ${result.error}`;
            break;
          }
          
        } catch (error) {
          const executionTime = Date.now() - taskStartTime;
          
          executedTasks.push({
            taskId: task.id,
            result: `Task execution failed: ${(error as Error).message}`,
            success: false,
            executionTime
          });
          
          task.status = 'failed';
          success = false;
          failureReason = `Task ${task.id} threw exception: ${(error as Error).message}`;
          break;
        }
      }
      
      // Update plan status
      plan.status = success ? 'completed' : 'failed';
      this.plans.set(plan.id, plan);
      
    } catch (error) {
      success = false;
      failureReason = `Plan execution failed: ${(error as Error).message}`;
      plan.status = 'failed';
      this.plans.set(plan.id, plan);
    }
    
    const totalTime = Date.now() - startTime;
    
    return {
      success,
      executedTasks,
      totalTime,
      failureReason
    };
  }
  
  /**
   * Get a plan by ID
   */
  public getPlan(planId: string): Plan | undefined {
    return this.plans.get(planId);
  }
  
  /**
   * Get all plans
   */
  public getAllPlans(): Plan[] {
    return Array.from(this.plans.values());
  }
  
  /**
   * Update a plan
   */
  public updatePlan(planId: string, updates: Partial<Plan>): boolean {
    const plan = this.plans.get(planId);
    if (!plan) {
      return false;
    }
    
    const updatedPlan = { ...plan, ...updates };
    this.plans.set(planId, updatedPlan);
    
    return true;
  }
  
  /**
   * Delete a plan
   */
  public deletePlan(planId: string): boolean {
    return this.plans.delete(planId);
  }
  
  /**
   * Analyze topic to determine plan structure
   */
  private async analyzeTopic(topic: string, context: Record<string, any>): Promise<{
    complexity: 'low' | 'medium' | 'high';
    domain: string;
    requiredSkills: string[];
    estimatedTime: number;
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    // Simple analysis based on topic keywords
    const topicLower = topic.toLowerCase();
    
    let complexity: 'low' | 'medium' | 'high' = 'medium';
    let domain = 'general';
    let requiredSkills: string[] = [];
    let estimatedTime = 60; // minutes
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    // Determine complexity
    if (topicLower.includes('complex') || topicLower.includes('advanced') || topicLower.includes('enterprise')) {
      complexity = 'high';
      estimatedTime = 120;
      riskLevel = 'medium';
    } else if (topicLower.includes('simple') || topicLower.includes('basic') || topicLower.includes('beginner')) {
      complexity = 'low';
      estimatedTime = 30;
    }
    
    // Determine domain
    if (topicLower.includes('security') || topicLower.includes('vulnerability')) {
      domain = 'security';
      requiredSkills = ['security-analysis', 'threat-modeling', 'penetration-testing'];
      riskLevel = 'high';
    } else if (topicLower.includes('code') || topicLower.includes('programming') || topicLower.includes('development')) {
      domain = 'development';
      requiredSkills = ['programming', 'code-review', 'testing'];
    } else if (topicLower.includes('data') || topicLower.includes('analysis') || topicLower.includes('research')) {
      domain = 'data-science';
      requiredSkills = ['data-analysis', 'statistics', 'visualization'];
    }
    
    return {
      complexity,
      domain,
      requiredSkills,
      estimatedTime,
      riskLevel
    };
  }
  
  /**
   * Generate tasks based on analysis
   */
  private async generateTasks(
    analysis: any, 
    councilId: string
  ): Promise<PlanTask[]> {
    const tasks: PlanTask[] = [];
    
    // Base tasks for any plan
    tasks.push({
      id: `task-1`,
      title: 'Initial Analysis',
      description: 'Perform initial analysis and requirement gathering',
      priority: 1,
      status: 'pending',
      estimatedTime: 15
    });
    
    // Domain-specific tasks
    switch (analysis.domain) {
      case 'security':
        tasks.push(
          {
            id: `task-2`,
            title: 'Security Assessment',
            description: 'Conduct comprehensive security assessment',
            priority: 2,
            status: 'pending',
            estimatedTime: 30
          },
          {
            id: `task-3`,
            title: 'Vulnerability Scanning',
            description: 'Perform automated and manual vulnerability scanning',
            priority: 3,
            status: 'pending',
            estimatedTime: 20
          },
          {
            id: `task-4`,
            title: 'Risk Mitigation Plan',
            description: 'Develop risk mitigation strategies',
            priority: 4,
            status: 'pending',
            estimatedTime: 25
          }
        );
        break;
        
      case 'development':
        tasks.push(
          {
            id: `task-2`,
            title: 'Code Review',
            description: 'Review existing codebase for quality and standards',
            priority: 2,
            status: 'pending',
            estimatedTime: 25
          },
          {
            id: `task-3`,
            title: 'Testing Strategy',
            description: 'Develop comprehensive testing strategy',
            priority: 3,
            status: 'pending',
            estimatedTime: 20
          },
          {
            id: `task-4`,
            title: 'Implementation Plan',
            description: 'Create detailed implementation roadmap',
            priority: 4,
            status: 'pending',
            estimatedTime: 15
          }
        );
        break;
        
      default:
        tasks.push(
          {
            id: `task-2`,
            title: 'Research and Planning',
            description: 'Conduct research and create detailed plan',
            priority: 2,
            status: 'pending',
            estimatedTime: 20
          },
          {
            id: `task-3`,
            title: 'Implementation',
            description: 'Execute the planned solution',
            priority: 3,
            status: 'pending',
            estimatedTime: 30
          }
        );
    }
    
    // Final validation task
    tasks.push({
      id: `task-final`,
      title: 'Validation and Review',
      description: 'Validate results and conduct final review',
      priority: tasks.length + 1,
      status: 'pending',
      estimatedTime: 10
    });
    
    return tasks;
  }
  
  /**
   * Execute a single task
   */
  private async executeTask(
    task: PlanTask, 
    context: Record<string, any>
  ): Promise<{
    success: boolean;
    output: string;
    error?: string;
  }> {
    try {
      console.log(`Executing task: ${task.id} - ${task.title}`);
      
      // Simulate task execution
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate realistic output based on task type
      let output = '';
      
      switch (task.title.toLowerCase()) {
        case 'initial analysis':
          output = 'Initial analysis completed. Requirements gathered and documented.';
          break;
        case 'security assessment':
          output = 'Security assessment completed. 3 medium-risk vulnerabilities identified.';
          break;
        case 'code review':
          output = 'Code review completed. Overall quality score: 8.5/10. 5 improvement suggestions provided.';
          break;
        case 'validation and review':
          output = 'Validation completed successfully. All deliverables meet acceptance criteria.';
          break;
        default:
          output = `Task "${task.title}" completed successfully with expected outcomes.`;
      }
      
      return {
        success: true,
        output
      };
      
    } catch (error) {
      return {
        success: false,
        output: '',
        error: (error as Error).message
      };
    }
  }
}
