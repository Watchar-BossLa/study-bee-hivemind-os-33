
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthError {
  message: string;
  code?: string;
}

interface AuthErrorHandlerProps {
  error: AuthError | null;
  onRetry?: () => void;
  onClearError?: () => void;
}

export function AuthErrorHandler({ error, onRetry, onClearError }: AuthErrorHandlerProps) {
  if (!error) return null;

  const getErrorMessage = (error: AuthError): string => {
    // Handle specific Supabase auth errors
    if (error.message.includes('Anonymous sign-ins are disabled')) {
      return 'Anonymous sign-ins are not allowed. Please create an account or sign in with your credentials.';
    }
    
    if (error.message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (error.message.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    
    if (error.message.includes('User already registered')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    
    if (error.message.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    
    if (error.message.includes('Invalid email')) {
      return 'Please enter a valid email address.';
    }
    
    // Fallback to original message
    return error.message || 'An authentication error occurred. Please try again.';
  };

  const getErrorTitle = (error: AuthError): string => {
    if (error.message.includes('Anonymous sign-ins are disabled')) {
      return 'Account Required';
    }
    
    if (error.message.includes('Invalid login credentials')) {
      return 'Invalid Credentials';
    }
    
    if (error.message.includes('Email not confirmed')) {
      return 'Email Confirmation Required';
    }
    
    if (error.message.includes('User already registered')) {
      return 'Account Already Exists';
    }
    
    return 'Authentication Error';
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{getErrorTitle(error)}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{getErrorMessage(error)}</p>
        <div className="flex gap-2 mt-3">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-8"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          )}
          {onClearError && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearError}
              className="h-8"
            >
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
