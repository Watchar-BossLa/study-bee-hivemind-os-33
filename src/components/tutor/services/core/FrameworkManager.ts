
import { SpecializedAgent } from '../../types/agents';
import { CrewAIPlanner } from '../frameworks/CrewAIPlanner';
import { A2AP2PHub } from '../frameworks/A2AP2PHub';
import { LangChainIntegration } from '../frameworks/LangChainIntegration';
import { OpenAISwarmWrapper } from '../frameworks/OpenAISwarmWrapper';
import { AutogenIntegration } from '../frameworks/AutogenIntegration';
import { Plan } from '../deliberation/types/voting-types';

export interface FrameworkConfig {
  enableCrewAI: boolean;
  enableLangChain: boolean;
  enableSwarm: boolean;
  enableAutogen: boolean;
  enableA2AP2P: boolean;
}

export class FrameworkManager {
  private crewAIPlanner: CrewAIPlanner;
  private a2ap2pHub: A2AP2PHub;
  private langChainIntegration: LangChainIntegration;
  private swarmWrapper: OpenAISwarmWrapper;
  private autogenIntegration: AutogenIntegration;
  private config: FrameworkConfig;

  constructor(config: FrameworkConfig = {
    enableCrewAI: true,
    enableLangChain: true,
    enableSwarm: true,
    enableAutogen: true,
    enableA2AP2P: true
  }) {
    this.config = config;
    this.crewAIPlanner = new CrewAIPlanner();
    this.a2ap2pHub = new A2AP2PHub();
    this.langChainIntegration = new LangChainIntegration([]);
    this.swarmWrapper = new OpenAISwarmWrapper([]);
    this.autogenIntegration = new AutogenIntegration();
  }

  public async createPlan(
    goal: string,
    context: Record<string, any>,
    agents: SpecializedAgent[]
  ): Promise<Plan> {
    if (!this.config.enableCrewAI) {
      throw new Error('CrewAI framework is disabled');
    }

    const agentIds = agents.map(agent => agent.id);
    return await this.crewAIPlanner.createPlan(goal, context, agentIds);
  }

  public async executeSwarmTask(
    task: string,
    agents: SpecializedAgent[]
  ): Promise<any> {
    if (!this.config.enableSwarm) {
      throw new Error('Swarm framework is disabled');
    }

    return await this.swarmWrapper.executeTasks([{ task, agents }]);
  }

  public async setupA2ACommunication(agents: SpecializedAgent[]): Promise<void> {
    if (!this.config.enableA2AP2P) {
      throw new Error('A2A P2P framework is disabled');
    }

    for (let i = 0; i < agents.length - 1; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        await this.a2ap2pHub.initiateConnection(agents[i], agents[j]);
      }
    }
  }

  public async runLangChainAgent(
    agent: SpecializedAgent,
    task: string
  ): Promise<any> {
    if (!this.config.enableLangChain) {
      throw new Error('LangChain framework is disabled');
    }

    return await this.langChainIntegration.runChain(agent, task);
  }

  public async executeAutogenConversation(
    agents: SpecializedAgent[],
    initialMessage: string
  ): Promise<any> {
    if (!this.config.enableAutogen) {
      throw new Error('Autogen framework is disabled');
    }

    return await this.autogenIntegration.runSecurityReview(initialMessage, { agents });
  }

  public async executePlan(plan: Plan): Promise<{ result: string; metadata: Record<string, any> }> {
    if (!this.config.enableCrewAI) {
      throw new Error('CrewAI framework is disabled');
    }

    return await this.crewAIPlanner.executePlan(plan);
  }

  public getFrameworkStatus(): FrameworkConfig {
    return { ...this.config };
  }

  public updateFrameworkConfig(newConfig: Partial<FrameworkConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
