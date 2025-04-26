
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Edit } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardsListProps {
  flashcards: Flashcard[];
  emptyMessage?: string;
}

const FlashcardsList: React.FC<FlashcardsListProps> = ({ 
  flashcards, 
  emptyMessage = "No flashcards created yet. Use the camera to create some!" 
}) => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  
  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (flashcards.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flashcards.map((card) => (
        <Card 
          key={card.id} 
          className="overflow-hidden cursor-pointer transition-all duration-300"
          onClick={() => toggleFlip(card.id)}
        >
          <CardContent className="p-0">
            <div className="relative">
              <div 
                className={`p-6 transition-opacity duration-300 ${
                  flippedCards[card.id] ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <h3 className="font-medium mb-2">{card.question}</h3>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFlip(card.id);
                    }}
                  >
                    Show Answer
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
              
              <div 
                className={`absolute inset-0 bg-background p-6 transition-opacity duration-300 ${
                  flippedCards[card.id] ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-sm text-muted-foreground mb-2">Answer:</p>
                <p className="font-medium">{card.answer}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlip(card.id);
                  }}
                >
                  Show Question
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlashcardsList;
