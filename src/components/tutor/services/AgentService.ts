
import { BaseAgent, SpecializedAgent } from '../types/agents';

export class AgentService {
  private agents: SpecializedAgent[];

  constructor(agents: SpecializedAgent[]) {
    this.agents = agents;
  }

  public getAgents(): SpecializedAgent[] {
    return this.agents;
  }

  public getAgentById(id: string): SpecializedAgent | undefined {
    return this.agents.find(agent => agent.id === id);
  }

  public updateAgentStatus(agentId: string, status: 'idle' | 'busy' | 'error'): void {
    const agent = this.getAgentById(agentId);
    if (agent) {
      agent.status = status;
    }
  }

  public getAvailableAgents(): SpecializedAgent[] {
    return this.agents.filter(agent => agent.status === 'idle');
  }
}
