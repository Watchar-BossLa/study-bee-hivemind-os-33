
import { PydanticSchema, SchemaField } from './PydanticSchema';

export interface Plan {
  id: string;
  title: string;
  type?: string;
  summary?: string;
  tasks: Array<{
    id: string;
    title?: string;
    description?: string;
    priority?: number;
  }>;
  memberCount?: number;
  members?: string[];
}

export interface InteractionContext {
  userId: string;
  sessionId?: string;
  complexity?: 'low' | 'medium' | 'high';
  urgency?: 'low' | 'medium' | 'high';
  costSensitivity?: 'low' | 'medium' | 'high';
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredModality?: 'text' | 'audio' | 'visual';
  preferences?: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  capabilities?: string[];
  knowledgeAreas?: string[];
  trustLevel?: 'low' | 'medium' | 'high';
}

export interface Council {
  id: string;
  name: string;
  agents: string[];
  domain?: string;
  consensusThreshold?: number;
  maxDeliberationTurns?: number;
}

/**
 * Register all schema models with the PydanticSchema instance
 */
export function registerSchemaModels(schema: PydanticSchema): void {
  // Plan Schema
  schema.defineSchema('Plan', {
    fields: {
      id: {
        type: 'string',
        required: true,
        description: 'Unique identifier for the plan'
      },
      title: {
        type: 'string',
        required: true,
        description: 'Title of the plan'
      },
      type: {
        type: 'string',
        enum: ['action', 'decision', 'learning', 'assessment', 'fix_plan'],
        default: 'action',
        description: 'Type of plan'
      },
      summary: {
        type: 'string',
        description: 'Summary of the plan'
      },
      tasks: {
        type: 'array',
        required: true,
        description: 'Tasks associated with the plan',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              required: true,
              description: 'Unique identifier for the task'
            },
            title: {
              type: 'string',
              description: 'Title of the task'
            },
            description: {
              type: 'string',
              description: 'Description of the task'
            },
            priority: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              default: 3,
              description: 'Priority of the task (1-5, where 5 is highest)'
            }
          }
        }
      },
      memberCount: {
        type: 'number',
        description: 'Number of members involved in this plan'
      },
      members: {
        type: 'array',
        description: 'List of member IDs involved in this plan',
        items: {
          type: 'string'
        }
      }
    },
    description: 'A plan created by CrewAI or other planning frameworks'
  });
  
  // InteractionContext Schema
  schema.defineSchema('InteractionContext', {
    fields: {
      userId: {
        type: 'string',
        required: true,
        description: 'ID of the user for this interaction'
      },
      sessionId: {
        type: 'string',
        description: 'ID of the current session'
      },
      complexity: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        description: 'Complexity level of the interaction'
      },
      urgency: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        description: 'Urgency level of the interaction'
      },
      costSensitivity: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        description: 'Cost sensitivity for this interaction'
      },
      userSkillLevel: {
        type: 'string',
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate',
        description: 'Skill level of the user'
      },
      preferredModality: {
        type: 'string',
        enum: ['text', 'audio', 'visual'],
        default: 'text',
        description: 'Preferred modality for this interaction'
      },
      preferences: {
        type: 'object',
        description: 'Additional preferences for this interaction'
      }
    },
    description: 'Context for user interactions with the system'
  });
  
  // Agent Schema
  schema.defineSchema('Agent', {
    fields: {
      id: {
        type: 'string',
        required: true,
        description: 'Unique identifier for the agent'
      },
      name: {
        type: 'string',
        required: true,
        description: 'Name of the agent'
      },
      capabilities: {
        type: 'array',
        description: 'List of capabilities this agent has',
        items: {
          type: 'string'
        }
      },
      knowledgeAreas: {
        type: 'array',
        description: 'Knowledge areas this agent specializes in',
        items: {
          type: 'string'
        }
      },
      trustLevel: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        description: 'Trust level assigned to this agent'
      }
    },
    description: 'An intelligent agent in the system'
  });
  
  // Council Schema
  schema.defineSchema('Council', {
    fields: {
      id: {
        type: 'string',
        required: true,
        description: 'Unique identifier for the council'
      },
      name: {
        type: 'string',
        required: true,
        description: 'Name of the council'
      },
      agents: {
        type: 'array',
        required: true,
        description: 'List of agent IDs that are part of this council',
        items: {
          type: 'string'
        }
      },
      domain: {
        type: 'string',
        description: 'Domain of expertise for this council'
      },
      consensusThreshold: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        default: 0.8,
        description: 'Threshold required for achieving consensus (0-1)'
      },
      maxDeliberationTurns: {
        type: 'number',
        minimum: 1,
        maximum: 10,
        default: 3,
        description: 'Maximum number of deliberation turns allowed'
      }
    },
    description: 'A council of agents that work together on specific domains'
  });
  
  console.log('Schema models registered successfully');
}
