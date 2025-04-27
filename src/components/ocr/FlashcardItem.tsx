
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Edit, 
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import FlashcardEditForm from './FlashcardEditForm';

interface FlashcardItemProps {
  id: string;
  question: string;
  answer: string;
  isFlipped: boolean;
  isEditing: boolean;
  isBookmarked: boolean;
  editFormData: { question: string; answer: string };
  onFlip: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onBookmark: () => void;
  onEditFormChange: (field: 'question' | 'answer', value: string) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({
  id,
  question,
  answer,
  isFlipped,
  isEditing,
  isBookmarked,
  editFormData,
  onFlip,
  onEdit,
  onSave,
  onCancel,
  onBookmark,
  onEditFormChange,
}) => {
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      isBookmarked ? 'border-primary/50' : ''
    }`}>
      <CardContent className="p-0">
        {isEditing ? (
          <FlashcardEditForm
            question={editFormData.question}
            answer={editFormData.answer}
            onSave={onSave}
            onCancel={onCancel}
            onChange={onEditFormChange}
          />
        ) : (
          <div className="relative">
            <div className={`p-6 transition-opacity duration-300 ${
              isFlipped ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="flex items-start justify-between">
                <h3 className="font-medium">{question}</h3>
                <button 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={onBookmark}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark this card"}
                >
                  {isBookmarked ? (
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
                  onClick={onEdit}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground"
                  onClick={onFlip}
                >
                  Show Answer
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className={`absolute inset-0 bg-background p-6 transition-opacity duration-300 ${
              isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onFlip}>
              <p className="text-sm text-muted-foreground mb-2">Answer:</p>
              <p className="font-medium">{answer}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground mt-4"
                onClick={onFlip}
              >
                Show Question
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardItem;
