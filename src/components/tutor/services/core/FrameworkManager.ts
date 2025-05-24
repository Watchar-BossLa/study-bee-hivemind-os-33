
import { CouncilService } from '../CouncilService';
import { LLMRouter } from '../LLMRouter';
import { AutogenIntegration } from '../frameworks/AutogenIntegration';
import { LangChainIntegration } from '../frameworks/LangChainIntegration';
import { OpenAISwarmWrapper } from '../frameworks/OpenAISwarmWrapper';
import { CrewAIPlanner } from '../frameworks/CrewAIPlanner';
import { LangChainQuotaGuard } from '../frameworks/LangChainQuotaGuard';
import { MCPCore } from './MCPCore';
import { AutogenTurnGuard } from '../frameworks/AutogenTurnGuard';

/**
 * FrameworkManager - Manages all AI framework integrations (Autogen, LangChain, OpenAI Swarm)
 * from the QuorumForge OS spec
 */
export class FrameworkManager {
  private autogenIntegration: AutogenIntegration;
  private langChainIntegration: LangChainIntegration;
  private swarmWrapper: OpenAISwarmWrapper;
  private crewAIPlanner: CrewAIPlanner;
  private langChainQuotaGuard: LangChainQuotaGuard;
  private autogenTurnGuard: AutogenTurnGuard;
  
  constructor(councilService: CouncilService, llmRouter: LLMRouter, mcpCore?: MCPCore) {
    this.langChainQuotaGuard = new LangChainQuotaGuard();
    this.autogenTurnGuard = new AutogenTurnGuard();
    
    if (mcpCore) {
      this.autogenIntegration = new AutogenIntegration(mcpCore);
    } else {
      console.warn('MCPCore not provided to FrameworkManager, limited functionality available');
      // Create a mock MCPCore for testing purposes
      const mockMCPCore = {
        submitTask: () => Promise.resolve('mock-task-id'),
        waitForTaskCompletion: () => Promise.resolve({ result: 'mock-result' }),
        getTaskStatus: () => ({ status: 'completed', result: 'mock-result' }),
        registerAgent: () => {},
        getAgent: () => null,
        removeAgent: () => false
      } as any;
      this.autogenIntegration = new AutogenIntegration(mockMCPCore);
    }
    
    this.langChainIntegration = new LangChainIntegration(llmRouter);
    this.swarmWrapper = new OpenAISwarmWrapper(llmRouter);
    this.crewAIPlanner = new CrewAIPlanner(councilService);
    
    console.log('Framework Manager initialized with Autogen, LangChain, and OpenAI Swarm');
  }
  
  /**
   * Get the Autogen integration
   */
  public getAutogenIntegration(): AutogenIntegration {
    return this.autogenIntegration;
  }
  
  /**
   * Get the LangChain integration
   */
  public getLangChainIntegration(): LangChainIntegration {
    return this.langChainIntegration;
  }
  
  /**
   * Get the OpenAI Swarm wrapper
   */
  public getSwarmWrapper(): OpenAISwarmWrapper {
    return this.swarmWrapper;
  }
  
  /**
   * Get the CrewAI planner
   */
  public getCrewAIPlanner(): CrewAIPlanner {
    return this.crewAIPlanner;
  }
  
  /**
   * Run a security review using Autogen
   */
  public async runSecurityReview(codeSnippet: string, securityContext: Record<string, any> = {}): Promise<any> {
    return this.autogenIntegration.runSecurityReview(codeSnippet, securityContext);
  }
  
  /**
   * Run a LangChain for a specific use case
   */
  public async runLangChain(chainId: string, input: Record<string, unknown>): Promise<any> {
    return this.langChainIntegration.runChain(chainId, input);
  }
  
  /**
   * Run parallel tasks using OpenAI Swarm
   */
  public async runSwarmTasks(tasks: any[], context: Record<string, any> = {}): Promise<any[]> {
    return this.swarmWrapper.executeTasks(tasks, context);
  }
  
  /**
   * Create a plan using CrewAI
   */
  public async createPlan(topic: string, councilId: string, context: Record<string, any> = {}): Promise<any> {
    return this.crewAIPlanner.createPlan(topic, councilId, context);
  }
  
  /**
   * Execute a plan using CrewAI
   */
  public async executePlan(plan: any, context: Record<string, any> = {}): Promise<any> {
    return this.crewAIPlanner.executePlan(plan, context);
  }
  
  /**
   * Get the Lang Chain quota guard
   */
  public getLangChainQuotaGuard(): LangChainQuotaGuard {
    return this.langChainQuotaGuard;
  }
  
  /**
   * Get the Autogen turn guard
   */
  public getAutogenTurnGuard(): AutogenTurnGuard {
    return this.autogenTurnGuard;
  }
}
