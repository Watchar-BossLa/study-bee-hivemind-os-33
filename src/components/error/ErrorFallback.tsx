
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps): React.ReactElement => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          {process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred"}
        </AlertDescription>
      </Alert>
      <Button 
        onClick={resetError} 
        variant="outline" 
        className="mt-4 flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
};
