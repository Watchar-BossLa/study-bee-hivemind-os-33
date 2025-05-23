
/**
 * PydanticSchema - Type-safe schema validation similar to Pydantic in Python
 * Implements the pydantic-schemas feature from QuorumForge OS spec
 */

// Basic types for schema validation
type SchemaType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any';

interface SchemaField {
  type: SchemaType;
  required?: boolean;
  default?: any;
  validator?: (value: any) => boolean;
  errorMessage?: string;
  items?: SchemaDefinition; // For array items
  properties?: Record<string, SchemaField>; // For object properties
  enum?: any[]; // For enumerated values
  minLength?: number; // For strings and arrays
  maxLength?: number; // For strings and arrays
  minimum?: number; // For numbers
  maximum?: number; // For numbers
  pattern?: string; // For strings (regex)
}

interface SchemaDefinition {
  name: string;
  fields: Record<string, SchemaField>;
  description?: string;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  validated?: Record<string, any>;
}

/**
 * PydanticSchema - Class for schema definition and validation
 */
export class PydanticSchema {
  private schemas: Map<string, SchemaDefinition> = new Map();
  
  constructor() {
    console.log('PydanticSchema initialized');
  }
  
  /**
   * Define a new schema
   */
  public defineSchema(schema: SchemaDefinition): void {
    if (this.schemas.has(schema.name)) {
      console.warn(`Schema "${schema.name}" already exists and will be overwritten`);
    }
    
    this.schemas.set(schema.name, schema);
    console.log(`Schema "${schema.name}" defined with ${Object.keys(schema.fields).length} fields`);
  }
  
  /**
   * Get schema definition
   */
  public getSchema(schemaName: string): SchemaDefinition | undefined {
    return this.schemas.get(schemaName);
  }
  
  /**
   * List all defined schemas
   */
  public listSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }
  
  /**
   * Validate data against a schema
   */
  public validate(data: Record<string, any>, schemaName: string): ValidationResult {
    const schema = this.schemas.get(schemaName);
    
    if (!schema) {
      return {
        valid: false,
        errors: [{ field: '_schema', message: `Schema "${schemaName}" not found` }]
      };
    }
    
    const errors: ValidationError[] = [];
    const validated: Record<string, any> = {};
    
    // Check for required fields and validate each field
    for (const [fieldName, fieldSchema] of Object.entries(schema.fields)) {
      // Check if the field is present
      if (!(fieldName in data)) {
        // Field is missing - check if it's required
        if (fieldSchema.required) {
          errors.push({
            field: fieldName,
            message: `Required field "${fieldName}" is missing`
          });
        } else if ('default' in fieldSchema) {
          // Use default value
          validated[fieldName] = fieldSchema.default;
        }
        continue;
      }
      
      const value = data[fieldName];
      const validationErrors = this.validateField(value, fieldSchema, fieldName);
      
      if (validationErrors.length > 0) {
        errors.push(...validationErrors);
      } else {
        validated[fieldName] = this.coerceValue(value, fieldSchema);
      }
    }
    
    // Return validation result
    return {
      valid: errors.length === 0,
      errors,
      validated: errors.length === 0 ? validated : undefined
    };
  }
  
  /**
   * Create a model instance with schema validation
   */
  public createModel<T extends Record<string, any>>(
    data: Record<string, any>, 
    schemaName: string
  ): T {
    const validation = this.validate(data, schemaName);
    
    if (!validation.valid) {
      const errorMessages = validation.errors.map(e => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    return validation.validated as T;
  }
  
  /**
   * Validate a specific field against its schema definition
   */
  private validateField(
    value: any,
    fieldSchema: SchemaField,
    fieldName: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Type validation
    if (!this.validateType(value, fieldSchema.type)) {
      errors.push({
        field: fieldName,
        message: fieldSchema.errorMessage || `Expected type "${fieldSchema.type}", got "${typeof value}"`,
        value
      });
      return errors; // Return early if type is invalid
    }
    
    // Enumeration validation
    if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
      errors.push({
        field: fieldName,
        message: `Value must be one of: ${fieldSchema.enum.join(', ')}`,
        value
      });
    }
    
    // String validations
    if (fieldSchema.type === 'string') {
      // Min length
      if (fieldSchema.minLength !== undefined && value.length < fieldSchema.minLength) {
        errors.push({
          field: fieldName,
          message: `String must be at least ${fieldSchema.minLength} characters long`,
          value
        });
      }
      
      // Max length
      if (fieldSchema.maxLength !== undefined && value.length > fieldSchema.maxLength) {
        errors.push({
          field: fieldName,
          message: `String must be at most ${fieldSchema.maxLength} characters long`,
          value
        });
      }
      
      // Regex pattern
      if (fieldSchema.pattern) {
        const regex = new RegExp(fieldSchema.pattern);
        if (!regex.test(value)) {
          errors.push({
            field: fieldName,
            message: `String must match pattern: ${fieldSchema.pattern}`,
            value
          });
        }
      }
    }
    
    // Number validations
    if (fieldSchema.type === 'number') {
      // Minimum
      if (fieldSchema.minimum !== undefined && value < fieldSchema.minimum) {
        errors.push({
          field: fieldName,
          message: `Number must be at least ${fieldSchema.minimum}`,
          value
        });
      }
      
      // Maximum
      if (fieldSchema.maximum !== undefined && value > fieldSchema.maximum) {
        errors.push({
          field: fieldName,
          message: `Number must be at most ${fieldSchema.maximum}`,
          value
        });
      }
    }
    
    // Array validations
    if (fieldSchema.type === 'array') {
      // Min length
      if (fieldSchema.minLength !== undefined && value.length < fieldSchema.minLength) {
        errors.push({
          field: fieldName,
          message: `Array must contain at least ${fieldSchema.minLength} items`,
          value
        });
      }
      
      // Max length
      if (fieldSchema.maxLength !== undefined && value.length > fieldSchema.maxLength) {
        errors.push({
          field: fieldName,
          message: `Array must contain at most ${fieldSchema.maxLength} items`,
          value
        });
      }
      
      // Validate array items if schema is provided
      if (fieldSchema.items && value.length > 0) {
        value.forEach((item: any, index: number) => {
          const itemErrors = this.validateField(
            item, 
            fieldSchema.items as SchemaField, 
            `${fieldName}[${index}]`
          );
          errors.push(...itemErrors);
        });
      }
    }
    
    // Object validations
    if (fieldSchema.type === 'object' && fieldSchema.properties) {
      for (const [propName, propSchema] of Object.entries(fieldSchema.properties)) {
        if (propSchema.required && !(propName in value)) {
          errors.push({
            field: `${fieldName}.${propName}`,
            message: `Required property "${propName}" is missing`
          });
          continue;
        }
        
        if (propName in value) {
          const propErrors = this.validateField(
            value[propName], 
            propSchema, 
            `${fieldName}.${propName}`
          );
          errors.push(...propErrors);
        }
      }
    }
    
    // Custom validator function
    if (fieldSchema.validator && !fieldSchema.validator(value)) {
      errors.push({
        field: fieldName,
        message: fieldSchema.errorMessage || `Validation failed for field "${fieldName}"`,
        value
      });
    }
    
    return errors;
  }
  
  /**
   * Validate that a value matches the expected type
   */
  private validateType(value: any, type: SchemaType): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'any':
        return true;
      default:
        return false;
    }
  }
  
  /**
   * Coerce value to the correct type if possible
   */
  private coerceValue(value: any, fieldSchema: SchemaField): any {
    // For now, just return the original value
    // In a more robust implementation, we could add type coercion here
    return value;
  }
}

// Utility function to create a new PydanticSchema instance
export function createPydanticSchema(): PydanticSchema {
  return new PydanticSchema();
}
