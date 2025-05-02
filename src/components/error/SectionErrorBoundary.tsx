
import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { SectionErrorFallback } from "./SectionErrorFallback";

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
}

export const SectionErrorBoundary = ({ 
  children, 
  sectionName 
}: SectionErrorBoundaryProps): React.ReactElement => {
  const handleError = (error: Error): void => {
    // This could be extended with section-specific error handling
    console.error(`Error in section ${sectionName || 'unknown'}:`, error);
  };

  return (
    <ErrorBoundary 
      fallback={SectionErrorFallback} 
      onError={(error) => handleError(error)}
    >
      {children}
    </ErrorBoundary>
  );
};
