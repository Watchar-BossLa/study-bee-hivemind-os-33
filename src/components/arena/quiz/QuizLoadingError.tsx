
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface QuizLoadingErrorProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const QuizLoadingError: React.FC<QuizLoadingErrorProps> = ({
  loading = false,
  error = null,
  onRetry
}) => {
  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Loading Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" variant="outline" onClick={onRetry}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};
