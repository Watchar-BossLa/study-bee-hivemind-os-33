
import { SpecializedAgent } from '../../types/agents';
import { RouterRequest } from '../../types/router';

export class CrewAI {
  private agents: Map<string, SpecializedAgent> = new Map();

  constructor(agents: SpecializedAgent[] = []) {
    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  public addAgent(agent: SpecializedAgent): void {
    this.agents.set(agent.id, agent);
  }

  public removeAgent(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  public getAgent(agentId: string): SpecializedAgent | undefined {
    return this.agents.get(agentId);
  }

  public async createCrew(
    agentIds: string[],
    goal: string,
    backstory?: string
  ): Promise<{
    id: string;
    agents: SpecializedAgent[];
    goal: string;
    backstory: string;
  }> {
    const selectedAgents = agentIds
      .map(id => this.agents.get(id))
      .filter(agent => agent !== undefined) as SpecializedAgent[];

    if (selectedAgents.length === 0) {
      throw new Error('No valid agents found for crew creation');
    }

    return {
      id: `crew-${Date.now()}`,
      agents: selectedAgents,
      goal,
      backstory: backstory || `A crew of ${selectedAgents.length} specialized agents working towards: ${goal}`
    };
  }

  public async executeCrew(
    crewId: string,
    task: string,
    context: Record<string, any> = {}
  ): Promise<{ result: string; metadata: Record<string, any> }> {
    try {
      // Simulate crew execution
      const result = `Crew ${crewId} executed task: ${task}`;
      const metadata = {
        crewId,
        task,
        context,
        timestamp: new Date().toISOString(),
        executionTime: Math.random() * 1000 + 500
      };

      return { result, metadata };
    } catch (error) {
      console.error('Error executing crew:', error);
      return {
        result: `Crew execution failed: ${error}`,
        metadata: {
          crewId,
          task,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  public async executeTask(
    agentId: string,
    task: any,
    context: Record<string, any> = {}
  ): Promise<{ result: string; metadata: Record<string, any> }> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Extract task properties safely
    const inputs = context.inputs || {};
    
    // Create router request for LLM selection
    const routerRequest: RouterRequest = {
      query: task.task || task.description || String(task),
      task: task.task || task.description || String(task),
      complexity: inputs.complexity || 'medium',
      urgency: inputs.urgency || 'medium',
      costSensitivity: inputs.costSensitivity || 'medium',
      contextLength: inputs.contextLength,
      userSkillLevel: inputs.userSkillLevel,
      topicId: inputs.topicId,
      preferredModality: inputs.preferredModality
    };

    // Simulate task execution
    const result = `Agent ${agent.name} executed task with router request`;
    const metadata = {
      agentId,
      agentName: agent.name,
      routerRequest,
      executionTime: Date.now(),
      domain: agent.domain
    };

    return { result, metadata };
  }

  public getAvailableAgents(): SpecializedAgent[] {
    return Array.from(this.agents.values()).filter(agent => agent.status === 'active');
  }

  public getAgentsByDomain(domain: string): SpecializedAgent[] {
    return Array.from(this.agents.values()).filter(agent => 
      agent.domain.toLowerCase() === domain.toLowerCase() && agent.status === 'active'
    );
  }
}
