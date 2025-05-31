
import { useState, useCallback } from 'react';
import { SecurityValidationService } from '@/services/security/SecurityValidationService';

interface FormField {
  value: string;
  error: string;
  warning: string;
  isValid: boolean;
}

interface FormState {
  [key: string]: FormField;
}

interface UseSecureFormOptions {
  onSubmit?: (sanitizedData: Record<string, string>) => void;
  customValidators?: Record<string, (value: string) => { isValid: boolean; error?: string }>;
}

export const useSecureForm = (initialFields: string[], options: UseSecureFormOptions = {}) => {
  const [formState, setFormState] = useState<FormState>(() => {
    const initial: FormState = {};
    initialFields.forEach(field => {
      initial[field] = {
        value: '',
        error: '',
        warning: '',
        isValid: true
      };
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((fieldName: string, value: string) => {
    let validationResult;

    // Use custom validator if provided
    if (options.customValidators?.[fieldName]) {
      const customResult = options.customValidators[fieldName](value);
      if (!customResult.isValid) {
        return {
          isValid: false,
          sanitizedValue: value,
          errors: [customResult.error || 'Invalid input'],
          warnings: []
        };
      }
    }

    // Apply built-in security validation
    switch (fieldName) {
      case 'email':
        validationResult = SecurityValidationService.validateEmailInput(value);
        break;
      case 'password':
        validationResult = SecurityValidationService.validatePasswordInput(value);
        break;
      default:
        validationResult = SecurityValidationService.validateUserInput(value, fieldName);
        break;
    }

    return validationResult;
  }, [options.customValidators]);

  const updateField = useCallback((fieldName: string, value: string) => {
    const validation = validateField(fieldName, value);
    
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        value: validation.sanitizedValue,
        error: validation.errors.join(', '),
        warning: validation.warnings.join(', '),
        isValid: validation.isValid
      }
    }));

    // Log security events for suspicious input
    if (validation.warnings.length > 0) {
      SecurityValidationService.logSecurityEvent(
        'Suspicious form input detected',
        { field: fieldName, originalValue: value, sanitizedValue: validation.sanitizedValue },
        'medium'
      );
    }
  }, [validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      const isFormValid = Object.values(formState).every(field => field.isValid);
      
      if (!isFormValid) {
        console.error('Form submission blocked: validation errors present');
        return;
      }

      // Extract sanitized values
      const sanitizedData: Record<string, string> = {};
      Object.entries(formState).forEach(([key, field]) => {
        sanitizedData[key] = field.value;
      });

      // Call onSubmit if provided
      if (options.onSubmit) {
        await options.onSubmit(sanitizedData);
      }

      SecurityValidationService.logSecurityEvent(
        'Secure form submitted successfully',
        { fields: Object.keys(sanitizedData) },
        'low'
      );

    } catch (error) {
      console.error('Form submission error:', error);
      SecurityValidationService.logSecurityEvent(
        'Form submission error',
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'high'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, options.onSubmit]);

  const resetForm = useCallback(() => {
    setFormState(prev => {
      const reset: FormState = {};
      Object.keys(prev).forEach(key => {
        reset[key] = {
          value: '',
          error: '',
          warning: '',
          isValid: true
        };
      });
      return reset;
    });
  }, []);

  const isFormValid = Object.values(formState).every(field => field.isValid && field.error === '');

  return {
    formState,
    updateField,
    handleSubmit,
    resetForm,
    isSubmitting,
    isFormValid
  };
};
