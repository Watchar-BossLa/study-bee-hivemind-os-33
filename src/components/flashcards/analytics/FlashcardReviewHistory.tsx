
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentFlashcardReviews } from '@/hooks/flashcards/useRecentFlashcardReviews';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-3 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                {review.was_correct ? (
                  <Badge variant="default" className="mr-2 flex items-center bg-green-100 text-green-800">
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
            {review.flashcard && (
              <div className="text-sm">
                <div className="font-medium">Q: {review.flashcard.question}</div>
                <div className="text-muted-foreground">
                  Subject: {review.flashcard.subject_area || 'General'} | 
                  Difficulty: {review.flashcard.difficulty || 'Unknown'}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FlashcardReviewHistory;
