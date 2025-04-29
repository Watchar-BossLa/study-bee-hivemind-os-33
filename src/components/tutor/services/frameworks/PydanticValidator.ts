
export class PydanticValidator {
  private schemas: Map<string, any> = new Map();
  
  constructor() {
    this.initializeSchemas();
    console.log('PydanticValidator initialized for runtime type safety');
  }
  
  private initializeSchemas(): void {
    // Define schemas similar to Pydantic models
    this.schemas.set('InteractionContext', {
      properties: {
        complexity: { type: 'string', enum: ['low', 'medium', 'high'] },
        urgency: { type: 'string', enum: ['low', 'medium', 'high'] },
        costSensitivity: { type: 'string', enum: ['low', 'medium', 'high'] },
        userSkillLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
        topicId: { type: 'string' },
        preferredModality: { type: 'string', enum: ['text', 'visual', 'audio'] },
        useCrewAI: { type: 'boolean' },
        sequential: { type: 'boolean' }
      },
      required: []
    });
    
    this.schemas.set('Plan', {
      properties: {
        planId: { type: 'string' },
        type: { type: 'string' },
        summary: { type: 'string' },
        riskScore: { type: 'number', minimum: 0, maximum: 1 },
        steps: { type: 'array', items: { type: 'string' } }
      },
      required: ['planId', 'type', 'summary']
    });
  }
  
  public validateContext(context: Record<string, any>): Record<string, any> {
    // Simple validation logic - in a real system this would be more robust
    const schema = this.schemas.get('InteractionContext');
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
  
  public validatePlan(plan: any): any {
    const schema = this.schemas.get('Plan');
    
    // Ensure required fields exist
    if (!plan.planId) plan.planId = `plan-${Date.now()}`;
    if (!plan.type) plan.type = 'default';
    if (!plan.summary) plan.summary = 'No summary provided';
    
    // Ensure riskScore is within bounds
    if (typeof plan.riskScore !== 'number') plan.riskScore = 0;
    plan.riskScore = Math.max(0, Math.min(1, plan.riskScore));
    
    return plan;
  }
}
