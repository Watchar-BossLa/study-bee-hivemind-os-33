
import { PydanticSchema } from './PydanticSchema';
import { registerSchemaModels, Plan, InteractionContext, Agent, Council } from './PydanticSchemaModels';

/**
 * PydanticAI Service - Provides schema validation for the application
 * Implements the pydantic-schemas feature from QuorumForge OS spec
 */
export class PydanticAIService {
  private schema: PydanticSchema;
  
  constructor() {
    this.schema = new PydanticSchema();
    registerSchemaModels(this.schema);
    
    console.log('PydanticAI Service initialized with schema models');
  }
  
  /**
   * Validate a plan against the Plan schema
   */
  public validatePlan(plan: Record<string, any>): { valid: boolean; errors: any[]; plan?: Plan } {
    const validation = this.schema.validate(plan, 'Plan');
    
    return {
      valid: validation.valid,
      errors: validation.errors,
      plan: validation.valid ? validation.validated as Plan : undefined
    };
  }
  
  /**
   * Create a validated plan or throw an error if validation fails
   */
  public createPlan(plan: Record<string, any>): Plan {
    try {
      return this.schema.createModel<Plan>(plan, 'Plan');
    } catch (error) {
      console.error('Plan validation error:', error);
      throw error;
    }
  }
  
  /**
   * Validate interaction context
   */
  public validateContext(context: Record<string, any>): { valid: boolean; errors: any[]; context?: InteractionContext } {
    const validation = this.schema.validate(context, 'InteractionContext');
    
    return {
      valid: validation.valid,
      errors: validation.errors,
      context: validation.valid ? validation.validated as InteractionContext : undefined
    };
  }
  
  /**
   * Create a validated interaction context
   */
  public createContext(context: Record<string, any>): InteractionContext {
    try {
      return this.schema.createModel<InteractionContext>(context, 'InteractionContext');
    } catch (error) {
      console.error('Context validation error:', error);
      throw error;
    }
  }
  
  /**
   * Validate agent
   */
  public validateAgent(agent: Record<string, any>): { valid: boolean; errors: any[]; agent?: Agent } {
    const validation = this.schema.validate(agent, 'Agent');
    
    return {
      valid: validation.valid,
      errors: validation.errors,
      agent: validation.valid ? validation.validated as Agent : undefined
    };
  }
  
  /**
   * Validate council
   */
  public validateCouncil(council: Record<string, any>): { valid: boolean; errors: any[]; council?: Council } {
    const validation = this.schema.validate(council, 'Council');
    
    return {
      valid: validation.valid,
      errors: validation.errors,
      council: validation.valid ? validation.validated as Council : undefined
    };
  }
  
  /**
   * Get the raw schema instance for advanced usage
   */
  public getSchema(): PydanticSchema {
    return this.schema;
  }
}

// Create a singleton instance
export const pydanticAI = new PydanticAIService();
