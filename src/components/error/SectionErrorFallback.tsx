
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface SectionErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const SectionErrorFallback = ({ 
  error, 
  resetErrorBoundary 
}: SectionErrorFallbackProps): React.ReactElement => {
  return (
    <Card className="w-full border-red-200">
      <CardHeader className="bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5" />
          Component Error
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground">
          This section encountered an error and couldn't be displayed properly.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-2 p-2 text-xs bg-muted rounded overflow-x-auto">
            {error.message}
          </pre>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={resetErrorBoundary} 
          size="sm" 
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-3 w-3" />
          Reload Section
        </Button>
      </CardFooter>
    </Card>
  );
};
