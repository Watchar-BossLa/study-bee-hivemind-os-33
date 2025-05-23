
import { PydanticAIService, pydanticAI } from './PydanticAIService';

/**
 * PydanticValidator - Runtime type validation using the PydanticAI service
 */
export class PydanticValidator {
  private pydanticService: PydanticAIService;
  
  constructor(pydanticService: PydanticAIService = pydanticAI) {
    this.pydanticService = pydanticService;
    console.log('PydanticValidator initialized for runtime type safety');
  }
  
  /**
   * Validate an interaction context
   */
  public validateContext(context: Record<string, any>): Record<string, any> {
    console.log('Validating interaction context');
    
    try {
      // Try to validate using the schema
      const validation = this.pydanticService.validateContext(context);
      
      if (validation.valid) {
        console.log('Context validation successful');
        return validation.context!;
      }
      
      // If validation failed, log the errors and apply fallback validation
      console.warn('Context validation failed:', validation.errors);
      return this.fallbackContextValidation(context);
      
    } catch (error) {
      console.error('Error during context validation:', error);
      return this.fallbackContextValidation(context);
    }
  }
  
  /**
   * Validate a plan
   */
  public validatePlan(plan: any): any {
    console.log('Validating plan');
    
    try {
      // Try to validate using the schema
      const validation = this.pydanticService.validatePlan(plan);
      
      if (validation.valid) {
        console.log('Plan validation successful');
        return validation.plan!;
      }
      
      // If validation failed, log the errors
      console.warn('Plan validation failed:', validation.errors);
      
      // For plans, we throw an error rather than using fallback validation
      // since plans need to be strictly validated
      throw new Error(`Plan validation failed: ${validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
      
    } catch (error) {
      console.error('Error during plan validation:', error);
      throw error;
    }
  }
  
  /**
   * Fallback validation for interaction context
   * Used when the schema validation fails
   */
  private fallbackContextValidation(context: Record<string, any>): Record<string, any> {
    // Simple validation logic - in a real system this would be more robust
    const validatedContext = { ...context };
    
    // Set defaults for missing properties
    if (!validatedContext.complexity) validatedContext.complexity = 'medium';
    if (!validatedContext.urgency) validatedContext.urgency = 'medium';
    if (!validatedContext.costSensitivity) validatedContext.costSensitivity = 'medium';
    if (!validatedContext.userSkillLevel) validatedContext.userSkillLevel = 'intermediate';
    if (!validatedContext.preferredModality) validatedContext.preferredModality = 'text';
    
    // Convert any invalid enum values to defaults
    if (!['low', 'medium', 'high'].includes(validatedContext.complexity)) {
      validatedContext.complexity = 'medium';
    }
    
    if (!['low', 'medium', 'high'].includes(validatedContext.urgency)) {
      validatedContext.urgency = 'medium';
    }
    
    if (!['low', 'medium', 'high'].includes(validatedContext.costSensitivity)) {
      validatedContext.costSensitivity = 'medium';
    }
    
    if (!['beginner', 'intermediate', 'advanced', 'expert'].includes(validatedContext.userSkillLevel)) {
      validatedContext.userSkillLevel = 'intermediate';
    }
    
    return validatedContext;
  }
}
