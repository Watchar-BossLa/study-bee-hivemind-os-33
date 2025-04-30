
import { OpenAISwarmWrapper } from '../frameworks/OpenAISwarmWrapper';
import { PydanticValidator } from '../frameworks/PydanticValidator';
import { LangChainIntegration } from '../frameworks/LangChainIntegration';
import { AutogenIntegration } from '../frameworks/AutogenIntegration';
import { CrewAIPlanner } from '../frameworks/CrewAIPlanner';
import { AgentToAgentHub } from '../frameworks/AgentToAgentHub';
import { CouncilService } from '../CouncilService';
import { LLMRouter } from '../LLMRouter';

export class FrameworkManager {
  private openAISwarm: OpenAISwarmWrapper;
  private pydanticValidator: PydanticValidator;
  private langChainIntegration: LangChainIntegration;
  private autogenIntegration: AutogenIntegration;
  private crewAIPlanner: CrewAIPlanner;
  private a2aHub: AgentToAgentHub;
  
  constructor(councilService: CouncilService, router: LLMRouter) {
    // Initialize framework integrations
    this.openAISwarm = new OpenAISwarmWrapper();
    this.pydanticValidator = new PydanticValidator();
    this.langChainIntegration = new LangChainIntegration(router);
    this.autogenIntegration = new AutogenIntegration(router);
    this.crewAIPlanner = new CrewAIPlanner(councilService);
    this.a2aHub = new AgentToAgentHub();
    
    // Initialize A2A Hub
    this.initializeA2AHub();
  }

  private initializeA2AHub(): void {
    this.a2aHub.registerCapabilities([
      'tutor', 'assessment', 'knowledge-validation', 'learning-path-design'
    ]);
    
    console.log('A2A Hub initialized on secondary port with OAuth-PKCE security');
  }
  
  public getOpenAISwarm(): OpenAISwarmWrapper {
    return this.openAISwarm;
  }
  
  public getPydanticValidator(): PydanticValidator {
    return this.pydanticValidator;
  }
  
  public getLangChainIntegration(): LangChainIntegration {
    return this.langChainIntegration;
  }
  
  public getAutogenIntegration(): AutogenIntegration {
    return this.autogenIntegration;
  }
  
  public getCrewAIPlanner(): CrewAIPlanner {
    return this.crewAIPlanner;
  }
  
  public getA2AHub(): AgentToAgentHub {
    return this.a2aHub;
  }
  
  public async communicateWithExternalAgent(
    agentId: string, 
    message: string, 
    capabilities: string[]
  ): Promise<any> {
    try {
      return await this.a2aHub.sendMessage(agentId, message, capabilities);
    } catch (error) {
      console.error("External agent communication failed:", error);
      throw new Error(`Failed to communicate with external agent: ${error.message}`);
    }
  }
}
