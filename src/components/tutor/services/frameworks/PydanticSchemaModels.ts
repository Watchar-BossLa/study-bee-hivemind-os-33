
import { PydanticSchema } from './PydanticSchema';

// Define the schemas for various model types used in the application
export function registerSchemaModels(schema: PydanticSchema): void {
  // Define Plan schema
  schema.defineSchema({
    name: 'Plan',
    description: 'A plan created by an agent or council',
    fields: {
      id: {
        type: 'string',
        required: true,
        errorMessage: 'Plan ID is required'
      },
      title: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 100,
        errorMessage: 'Plan title must be between 3 and 100 characters'
      },
      description: {
        type: 'string',
        required: false,
        maxLength: 1000
      },
      type: {
        type: 'string',
        required: true,
        enum: ['action', 'research', 'strategy', 'fix', 'enhance'],
        errorMessage: 'Plan type must be one of: action, research, strategy, fix, enhance'
      },
      created: {
        type: 'string', // ISO date string
        required: false,
        default: () => new Date().toISOString(),
        validator: (value) => !isNaN(Date.parse(value)),
        errorMessage: 'Invalid date format'
      },
      priority: {
        type: 'string',
        required: false,
        default: 'medium',
        enum: ['low', 'medium', 'high', 'critical'],
        errorMessage: 'Priority must be one of: low, medium, high, critical'
      },
      tasks: {
        type: 'array',
        required: true,
        minLength: 1,
        errorMessage: 'Plan must contain at least one task',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              required: true
            },
            title: {
              type: 'string',
              required: true
            },
            description: {
              type: 'string',
              required: false
            },
            assignedTo: {
              type: 'string',
              required: false
            },
            status: {
              type: 'string',
              required: false,
              default: 'pending',
              enum: ['pending', 'in-progress', 'completed', 'failed'],
              errorMessage: 'Task status must be one of: pending, in-progress, completed, failed'
            }
          }
        }
      },
      metadata: {
        type: 'object',
        required: false,
        properties: {
          costEstimate: {
            type: 'number',
            required: false,
            minimum: 0
          },
          timeEstimate: {
            type: 'number',
            required: false,
            minimum: 0
          },
          riskLevel: {
            type: 'number',
            required: false,
            minimum: 0,
            maximum: 1
          },
          tags: {
            type: 'array',
            required: false,
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  });
  
  // Define InteractionContext schema
  schema.defineSchema({
    name: 'InteractionContext',
    description: 'Context for user interactions with the system',
    fields: {
      userId: {
        type: 'string',
        required: true
      },
      sessionId: {
        type: 'string',
        required: true
      },
      timestamp: {
        type: 'string', // ISO date string
        required: false,
        default: () => new Date().toISOString()
      },
      complexity: {
        type: 'string',
        required: false,
        default: 'medium',
        enum: ['low', 'medium', 'high'],
        errorMessage: 'Complexity must be one of: low, medium, high'
      },
      urgency: {
        type: 'string',
        required: false,
        default: 'medium',
        enum: ['low', 'medium', 'high'],
        errorMessage: 'Urgency must be one of: low, medium, high'
      },
      topicId: {
        type: 'string',
        required: false
      },
      userSkillLevel: {
        type: 'string',
        required: false,
        default: 'intermediate',
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        errorMessage: 'Skill level must be one of: beginner, intermediate, advanced, expert'
      },
      preferredModality: {
        type: 'string',
        required: false,
        default: 'text',
        enum: ['text', 'visual', 'audio'],
        errorMessage: 'Preferred modality must be one of: text, visual, audio'
      }
    }
  });
  
  // Define Agent schema
  schema.defineSchema({
    name: 'Agent',
    description: 'An agent in the system',
    fields: {
      id: {
        type: 'string',
        required: true
      },
      name: {
        type: 'string',
        required: true
      },
      type: {
        type: 'string',
        required: true,
        enum: ['specialized', 'general', 'coordinator', 'security'],
        errorMessage: 'Agent type must be one of: specialized, general, coordinator, security'
      },
      capabilities: {
        type: 'array',
        required: true,
        minLength: 1,
        items: {
          type: 'string'
        }
      },
      model: {
        type: 'string',
        required: false,
        default: 'gpt-4o-mini'
      }
    }
  });
  
  // Define Council schema
  schema.defineSchema({
    name: 'Council',
    description: 'A council of agents',
    fields: {
      id: {
        type: 'string',
        required: true
      },
      name: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string',
        required: false
      },
      members: {
        type: 'array',
        required: true,
        minLength: 2,
        errorMessage: 'Council must have at least 2 members',
        items: {
          type: 'string' // agent IDs
        }
      },
      consensusThreshold: {
        type: 'number',
        required: false,
        default: 0.8,
        minimum: 0.5,
        maximum: 1.0,
        errorMessage: 'Consensus threshold must be between 0.5 and 1.0'
      },
      maxDeliberationRounds: {
        type: 'number',
        required: false,
        default: 3,
        minimum: 1,
        maximum: 10,
        errorMessage: 'Max deliberation rounds must be between 1 and 10'
      }
    }
  });
  
  console.log('Schema models registered successfully');
}

// Create Plan type that matches the schema
export interface Plan {
  id: string;
  title: string;
  description?: string;
  type: 'action' | 'research' | 'strategy' | 'fix' | 'enhance';
  created?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    assignedTo?: string;
    status?: 'pending' | 'in-progress' | 'completed' | 'failed';
  }>;
  metadata?: {
    costEstimate?: number;
    timeEstimate?: number;
    riskLevel?: number;
    tags?: string[];
  };
}

// Create InteractionContext type that matches the schema
export interface InteractionContext {
  userId: string;
  sessionId: string;
  timestamp?: string;
  complexity?: 'low' | 'medium' | 'high';
  urgency?: 'low' | 'medium' | 'high';
  topicId?: string;
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredModality?: 'text' | 'visual' | 'audio';
}

// Create Agent type that matches the schema
export interface Agent {
  id: string;
  name: string;
  type: 'specialized' | 'general' | 'coordinator' | 'security';
  capabilities: string[];
  model?: string;
}

// Create Council type that matches the schema
export interface Council {
  id: string;
  name: string;
  description?: string;
  members: string[];
  consensusThreshold?: number;
  maxDeliberationRounds?: number;
}
