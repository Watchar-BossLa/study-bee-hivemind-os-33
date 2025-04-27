import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  Edit, 
  Check, 
  X,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardsListProps {
  uploadId?: string;
  emptyMessage?: string;
  onEdit?: (id: string, updatedCard: { question: string; answer: string }) => void;
}

const FlashcardsList: React.FC<FlashcardsListProps> = ({ 
  uploadId,
  emptyMessage = "No flashcards created yet. Use the camera to create some!",
  onEdit
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{ question: string; answer: string }>({
    question: '',
    answer: ''
  });
  const [bookmarkedCards, setBookmarkedCards] = useState<Record<string, boolean>>({});
  
  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const startEditing = (card: Flashcard) => {
    setEditingCard(card.id);
    setEditFormData({
      question: card.question,
      answer: card.answer
    });
  };
  
  const cancelEditing = () => {
    setEditingCard(null);
  };
  
  const handleEditChange = (field: 'question' | 'answer', value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const saveEdit = (id: string) => {
    if (onEdit) {
      onEdit(id, editFormData);
    }
    setEditingCard(null);
  };
  
  const toggleBookmark = (id: string) => {
    setBookmarkedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
      try {
        const query = supabase
          .from('flashcards')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (uploadId) {
          query.eq('upload_id', uploadId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setFlashcards(data || []);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [uploadId]);

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
          className={`overflow-hidden transition-all duration-300 ${
            bookmarkedCards[card.id] ? 'border-primary/50' : ''
          }`}
        >
          <CardContent className="p-0">
            {editingCard === card.id ? (
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`question-${card.id}`}>Question</Label>
                    <Input 
                      id={`question-${card.id}`}
                      value={editFormData.question}
                      onChange={(e) => handleEditChange('question', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`answer-${card.id}`}>Answer</Label>
                    <Input 
                      id={`answer-${card.id}`}
                      value={editFormData.answer}
                      onChange={(e) => handleEditChange('answer', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={cancelEditing}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => saveEdit(card.id)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div 
                  className={`p-6 transition-opacity duration-300 ${
                    flippedCards[card.id] ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{card.question}</h3>
                    <button 
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(card.id);
                      }}
                      title={bookmarkedCards[card.id] ? "Remove bookmark" : "Bookmark this card"}
                    >
                      {bookmarkedCards[card.id] ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(card);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground"
                      onClick={() => toggleFlip(card.id)}
                    >
                      Show Answer
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div 
                  className={`absolute inset-0 bg-background p-6 transition-opacity duration-300 ${
                    flippedCards[card.id] ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  onClick={() => toggleFlip(card.id)}
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
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlashcardsList;
