
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FlashcardReview from './FlashcardReview';
import FlashcardFilters from './FlashcardFilters';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { FlashcardFilter } from '@/components/shared/flashcards/types';

const ReviewSession = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [filters, setFilters] = useState<FlashcardFilter>({
    subject: undefined,
    difficulty: undefined,
    showPreloaded: true
  });

  const { data: flashcards, isLoading, refetch } = useQuery({
    queryKey: ['due-flashcards', filters],
    queryFn: async () => {
      let query = supabase
        .from('flashcards')
        .select('*')
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at');
      
      // Apply subject filter if selected
      if (filters.subject) {
        query = query.eq('subject_area', filters.subject);
      }
      
      // Apply difficulty filter if selected
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      
      // Filter by preloaded status
      if (!filters.showPreloaded) {
        query = query.eq('is_preloaded', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleApplyFilters = () => {
    setCurrentIndex(0);
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading review session...</span>
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
          <p className="mb-4">Great job! You've reviewed all your due cards with the current filters.</p>
          
          <FlashcardFilters 
            filters={filters}
            onFilterChange={setFilters}
            onApply={handleApplyFilters}
          />
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        
        <div className="flex items-center space-x-2">
          {currentCard.subject_area && (
            <span className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full">
              {currentCard.subject_area.charAt(0).toUpperCase() + currentCard.subject_area.slice(1)}
            </span>
          )}
          {currentCard.difficulty && (
            <span className="bg-secondary/10 text-secondary text-xs py-1 px-2 rounded-full">
              {currentCard.difficulty.charAt(0).toUpperCase() + currentCard.difficulty.slice(1)}
            </span>
          )}
          {currentCard.is_preloaded && (
            <span className="bg-muted text-muted-foreground text-xs py-1 px-2 rounded-full">
              Preloaded
            </span>
          )}
        </div>
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
      
      <div className="pt-4">
        <FlashcardFilters 
          filters={filters}
          onFilterChange={setFilters}
          onApply={handleApplyFilters}
          compact
        />
      </div>
    </div>
  );
};

export default ReviewSession;
