
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommandErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface CommandErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class CommandErrorBoundary extends Component<CommandErrorBoundaryProps, CommandErrorBoundaryState> {
  constructor(props: CommandErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): CommandErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any): void {
    console.error('Command component error:', error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Command Interface Error</AlertTitle>
          <AlertDescription className="mt-2">
            <p>There was an error with the command interface. This might be due to keyboard navigation components.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={this.resetError}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
