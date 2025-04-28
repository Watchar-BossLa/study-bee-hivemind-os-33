
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FlashcardReview from './FlashcardReview';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReviewSession = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const { data: flashcards, isLoading } = useQuery({
    queryKey: ['due-flashcards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at');
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          Loading review session...
        </CardContent>
      </Card>
    );
  }

  if (!flashcards?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cards Due for Review</CardTitle>
        </CardHeader>
        <CardContent>
          Great job! You've reviewed all your due cards. Come back later for more reviews.
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground text-center">
        Card {currentIndex + 1} of {flashcards.length}
      </div>
      
      <FlashcardReview
        key={currentCard.id}
        id={currentCard.id}
        question={currentCard.question}
        answer={currentCard.answer}
        onComplete={() => {
          if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
        }}
      />
    </div>
  );
};

export default ReviewSession;
