
/**
 * PydanticSchema - Core schema validation engine
 * Implements the pydantic-schemas feature from QuorumForge OS spec
 */
export interface SchemaField {
  type: string;
  required?: boolean;
  default?: any;
  description?: string;
  enum?: string[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  format?: string;
  pattern?: string;
  properties?: Record<string, SchemaField>;
  items?: SchemaField;
}

export interface SchemaDefinition {
  fields: Record<string, SchemaField>;
  description?: string;
  examples?: any[];
}

export interface ValidationResult<T = any> {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  validated?: T;
}

/**
 * PydanticSchema - Provides schema validation similar to Python's Pydantic
 */
export class PydanticSchema {
  private schemas: Map<string, SchemaDefinition> = new Map();
  
  /**
   * Define a new schema
   */
  public defineSchema(name: string, schema: SchemaDefinition): void {
    this.schemas.set(name, schema);
    console.log(`Schema "${name}" defined with ${Object.keys(schema.fields).length} fields`);
  }
  
  /**
   * Get a schema by name
   */
  public getSchema(name: string): SchemaDefinition | undefined {
    return this.schemas.get(name);
  }
  
  /**
   * Check if a schema exists
   */
  public hasSchema(name: string): boolean {
    return this.schemas.has(name);
  }
  
  /**
   * List all defined schema names
   */
  public listSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }
  
  /**
   * Validate data against a schema
   */
  public validate<T = any>(data: any, schemaName: string): ValidationResult<T> {
    const schema = this.schemas.get(schemaName);
    
    if (!schema) {
      return {
        valid: false,
        errors: [{
          field: 'schema',
          message: `Schema "${schemaName}" not found`
        }]
      };
    }
    
    const errors: Array<{
      field: string;
      message: string;
      value?: any;
    }> = [];
    
    // Check required fields
    for (const [fieldName, fieldDef] of Object.entries(schema.fields)) {
      if (fieldDef.required && (data[fieldName] === undefined || data[fieldName] === null)) {
        errors.push({
          field: fieldName,
          message: `Required field "${fieldName}" is missing`
        });
      }
    }
    
    // Validate fields
    for (const [fieldName, value] of Object.entries(data)) {
      const fieldDef = schema.fields[fieldName];
      
      if (!fieldDef) {
        // Skip unknown fields
        continue;
      }
      
      // Validate field value
      const fieldErrors = this.validateField(value, fieldDef, fieldName);
      errors.push(...fieldErrors);
    }
    
    // If valid, create a validated object with default values
    if (errors.length === 0) {
      const validated = { ...data };
      
      // Apply default values for missing optional fields
      for (const [fieldName, fieldDef] of Object.entries(schema.fields)) {
        if (fieldDef.default !== undefined && validated[fieldName] === undefined) {
          validated[fieldName] = fieldDef.default;
        }
      }
      
      return {
        valid: true,
        errors: [],
        validated: validated as T
      };
    }
    
    return {
      valid: false,
      errors
    };
  }
  
  /**
   * Create a model instance from data
   */
  public createModel<T = any>(data: any, schemaName: string): T {
    const result = this.validate<T>(data, schemaName);
    
    if (!result.valid) {
      const errorMessages = result.errors.map(e => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    return result.validated as T;
  }
  
  /**
   * Validate a single field against its schema definition
   */
  private validateField(
    value: any, 
    fieldDef: SchemaField, 
    fieldName: string, 
    path: string = ''
  ): Array<{ field: string; message: string; value?: any }> {
    const errors: Array<{ field: string; message: string; value?: any }> = [];
    const fullPath = path ? `${path}.${fieldName}` : fieldName;
    
    // Skip validation if value is undefined and field is not required
    if (value === undefined) {
      return errors;
    }
    
    // Validate by type
    switch (fieldDef.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({
            field: fullPath,
            message: `Expected string, got ${typeof value}`,
            value
          });
          return errors;
        }
        
        if (fieldDef.minLength !== undefined && value.length < fieldDef.minLength) {
          errors.push({
            field: fullPath,
            message: `String is too short, minimum length is ${fieldDef.minLength}`,
            value
          });
        }
        
        if (fieldDef.maxLength !== undefined && value.length > fieldDef.maxLength) {
          errors.push({
            field: fullPath,
            message: `String is too long, maximum length is ${fieldDef.maxLength}`,
            value
          });
        }
        
        if (fieldDef.pattern !== undefined) {
          const regex = new RegExp(fieldDef.pattern);
          if (!regex.test(value)) {
            errors.push({
              field: fullPath,
              message: `String does not match pattern ${fieldDef.pattern}`,
              value
            });
          }
        }
        
        if (fieldDef.enum !== undefined && !fieldDef.enum.includes(value)) {
          errors.push({
            field: fullPath,
            message: `Value must be one of: ${fieldDef.enum.join(', ')}`,
            value
          });
        }
        
        break;
        
      case 'number':
        if (typeof value !== 'number') {
          errors.push({
            field: fullPath,
            message: `Expected number, got ${typeof value}`,
            value
          });
          return errors;
        }
        
        if (fieldDef.minimum !== undefined && value < fieldDef.minimum) {
          errors.push({
            field: fullPath,
            message: `Number is too small, minimum value is ${fieldDef.minimum}`,
            value
          });
        }
        
        if (fieldDef.maximum !== undefined && value > fieldDef.maximum) {
          errors.push({
            field: fullPath,
            message: `Number is too large, maximum value is ${fieldDef.maximum}`,
            value
          });
        }
        
        break;
        
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            field: fullPath,
            message: `Expected boolean, got ${typeof value}`,
            value
          });
        }
        break;
        
      case 'array':
        if (!Array.isArray(value)) {
          errors.push({
            field: fullPath,
            message: `Expected array, got ${typeof value}`,
            value
          });
          return errors;
        }
        
        if (fieldDef.items) {
          // Validate array items
          value.forEach((item, index) => {
            const itemErrors = this.validateField(
              item, 
              fieldDef.items!, 
              `${index}`, 
              fullPath
            );
            errors.push(...itemErrors);
          });
        }
        break;
        
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push({
            field: fullPath,
            message: `Expected object, got ${typeof value}`,
            value
          });
          return errors;
        }
        
        if (fieldDef.properties) {
          // Validate object properties
          for (const [propName, propDef] of Object.entries(fieldDef.properties)) {
            if (propDef.required && (value[propName] === undefined || value[propName] === null)) {
              errors.push({
                field: `${fullPath}.${propName}`,
                message: `Required property "${propName}" is missing`
              });
            } else if (value[propName] !== undefined) {
              const propErrors = this.validateField(
                value[propName], 
                propDef, 
                propName, 
                fullPath
              );
              errors.push(...propErrors);
            }
          }
        }
        
        break;
        
      default:
        // Unknown type
        errors.push({
          field: fullPath,
          message: `Unknown type: ${fieldDef.type}`
        });
    }
    
    return errors;
  }
}
