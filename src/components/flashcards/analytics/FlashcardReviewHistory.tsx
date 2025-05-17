
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentFlashcardReviews } from '@/hooks/useFlashcardAnalytics';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Define an extended type that includes the properties we're expecting
interface FlashcardReviewWithContent {
  id: string;
  was_correct: boolean;
  review_time: string;
  confidence_level?: number | null;
  flashcard_id: string;
  question: string;
  answer: string;
}

const FlashcardReviewHistory = () => {
  const { data: reviews, isLoading } = useRecentFlashcardReviews(20);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/5" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No review history yet. Start reviewing flashcards to see your history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Reviews</span>
          <span className="text-sm text-muted-foreground">
            {reviews.filter(r => r.was_correct).length} correct of {reviews.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(reviews as FlashcardReviewWithContent[]).map((review) => (
          <div key={review.id} className="border-b pb-3 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                {review.was_correct ? (
                  <Badge variant="success" className="mr-2 flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Correct
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="mr-2 flex items-center">
                    <X className="h-3 w-3 mr-1" /> Incorrect
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(review.review_time), 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Q: {review.question}</div>
              <div className="text-muted-foreground">A: {review.answer}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FlashcardReviewHistory;
