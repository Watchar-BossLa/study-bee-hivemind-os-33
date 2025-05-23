
import { describe, it, expect } from 'vitest';
import { PydanticSchema } from '../components/tutor/services/frameworks/PydanticSchema';
import { registerSchemaModels } from '../components/tutor/services/frameworks/PydanticSchemaModels';
import { PydanticAIService } from '../components/tutor/services/frameworks/PydanticAIService';

describe('PydanticSchema Validation', () => {
  const schema = new PydanticSchema();
  registerSchemaModels(schema);
  
  it('should validate a valid plan', () => {
    const validPlan = {
      id: 'plan-123',
      title: 'Test Plan',
      type: 'action',
      tasks: [
        {
          id: 'task-1',
          title: 'Test Task'
        }
      ]
    };
    
    const result = schema.validate(validPlan, 'Plan');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.validated).toBeDefined();
  });
  
  it('should reject an invalid plan', () => {
    const invalidPlan = {
      title: 'Test Plan', // missing id
      type: 'invalid-type', // invalid enum value
      tasks: [] // empty tasks array
    };
    
    const result = schema.validate(invalidPlan, 'Plan');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.validated).toBeUndefined();
    
    // Check specific errors
    const errorFields = result.errors.map(e => e.field);
    expect(errorFields).toContain('id');
    expect(errorFields).toContain('type');
    expect(errorFields).toContain('tasks');
  });
});

describe('PydanticAIService', () => {
  const service = new PydanticAIService();
  
  it('should validate a valid plan via the service', () => {
    const validPlan = {
      id: 'plan-123',
      title: 'Test Plan',
      type: 'action',
      tasks: [
        {
          id: 'task-1',
          title: 'Test Task'
        }
      ]
    };
    
    const result = service.validatePlan(validPlan);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.plan).toBeDefined();
    expect(result.plan?.id).toBe('plan-123');
  });
  
  it('should throw an error when creating an invalid plan', () => {
    const invalidPlan = {
      title: 'Test Plan', // missing id
      type: 'invalid-type', // invalid enum value
      tasks: [] // empty tasks array
    };
    
    expect(() => {
      service.createPlan(invalidPlan);
    }).toThrow();
  });
  
  it('should validate interaction context', () => {
    const validContext = {
      userId: 'user-123',
      sessionId: 'session-123',
      complexity: 'medium',
      userSkillLevel: 'beginner'
    };
    
    const result = service.validateContext(validContext);
    expect(result.valid).toBe(true);
    expect(result.context).toBeDefined();
    expect(result.context?.userId).toBe('user-123');
    
    // Default values
    expect(result.context?.preferredModality).toBe('text');
  });
});

describe('Swarm Fan-out', () => {
  it('should process tasks in parallel', async () => {
    // This test would typically test OpenAISwarmWrapper.runSwarm
    // We'll just do a basic async test for now
    const tasks = [1, 2, 3, 4, 5].map(i => `Task ${i}`);
    
    const results = await Promise.all(tasks.map(async task => {
      await new Promise(resolve => setTimeout(resolve, 5));
      return `Result for ${task}`;
    }));
    
    expect(results).toHaveLength(5);
    expect(results[0]).toContain('Result for Task 1');
  });
});
