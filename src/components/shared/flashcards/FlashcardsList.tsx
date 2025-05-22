
import React, { useState } from 'react';
import FlashcardItem from './FlashcardItem';
import { Flashcard } from './types';

interface FlashcardsListProps {
  uploadId?: string;
  emptyMessage?: string;
  onEdit?: (id: string, updatedCard: { question: string; answer: string }) => void;
  flashcards: Flashcard[];
}

const FlashcardsList: React.FC<FlashcardsListProps> = ({ 
  uploadId,
  emptyMessage = "No flashcards created yet. Use the camera to create some!",
  onEdit,
  flashcards
}) => {
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
        <div key={card.id} className="relative">
          {/* Subject and difficulty badges */}
          {(card.subject_area || card.difficulty || card.is_preloaded) && (
            <div className="absolute top-2 right-2 flex flex-wrap gap-1 max-w-[200px] z-10">
              {card.subject_area && (
                <span className="bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                  {card.subject_area.charAt(0).toUpperCase() + card.subject_area.slice(1)}
                </span>
              )}
              {card.difficulty && (
                <span className="bg-secondary/10 text-secondary text-xs py-0.5 px-2 rounded-full">
                  {card.difficulty.charAt(0).toUpperCase() + card.difficulty.slice(1)}
                </span>
              )}
              {card.is_preloaded && (
                <span className="bg-muted text-muted-foreground text-xs py-0.5 px-2 rounded-full">
                  Preloaded
                </span>
              )}
            </div>
          )}
          
          <FlashcardItem
            id={card.id}
            question={card.question}
            answer={card.answer}
            isFlipped={flippedCards[card.id] || false}
            isEditing={editingCard === card.id}
            isBookmarked={bookmarkedCards[card.id] || false}
            editFormData={editFormData}
            onFlip={() => toggleFlip(card.id)}
            onEdit={() => startEditing(card)}
            onSave={() => saveEdit(card.id)}
            onCancel={cancelEditing}
            onBookmark={() => toggleBookmark(card.id)}
            onEditFormChange={handleEditChange}
          />
        </div>
      ))}
    </div>
  );
};

export default FlashcardsList;
