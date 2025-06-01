
import { useState, useCallback } from 'react';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function useAuthValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateEmail = useCallback((email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }, []);

  const validatePassword = useCallback((password: string): ValidationResult => {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    
    return { isValid: true };
  }, []);

  const validateConfirmPassword = useCallback((password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
      return { isValid: false, error: 'Please confirm your password' };
    }
    
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }
    
    return { isValid: true };
  }, []);

  const validateFullName = useCallback((fullName: string): ValidationResult => {
    if (!fullName) {
      return { isValid: false, error: 'Full name is required' };
    }
    
    if (fullName.trim().length < 2) {
      return { isValid: false, error: 'Full name must be at least 2 characters long' };
    }
    
    return { isValid: true };
  }, []);

  const setFieldError = useCallback((field: string, error?: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  return {
    validationErrors,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateFullName,
    setFieldError,
    clearFieldError,
    clearAllErrors
  };
}
