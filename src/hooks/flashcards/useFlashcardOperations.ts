
import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useFlashcardOperations() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const editFlashcard = useMutation({
    mutationFn: async ({ id, updatedCard }: { 
      id: string; 
      updatedCard: { question: string; answer: string } 
    }) => {
      if (!user) throw new Error('Authentication required');
      
      // Check if this is a preloaded card
      const { data: flashcard } = await supabase
        .from('flashcards')
        .select('*')
        .eq('id', id)
        .single();
      
      if (flashcard?.is_preloaded) {
        // Create a copy for the user
        const { error: insertError } = await supabase
          .from('flashcards')
          .insert({
            user_id: user.id,
            question: updatedCard.question,
            answer: updatedCard.answer,
            subject_area: flashcard.subject_area,
            difficulty: flashcard.difficulty,
            is_preloaded: false
          });
        
        if (insertError) throw insertError;
        return { type: 'copied' };
      } else {
        // Update directly
        const { error: updateError } = await supabase
          .from('flashcards')
          .update({
            question: updatedCard.question,
            answer: updatedCard.answer,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
        return { type: 'updated' };
      }
    },
    onSuccess: (result) => {
      const message = result.type === 'copied' 
        ? 'Card copied to your collection'
        : 'Card updated successfully';
      
      toast({
        title: message,
        description: result.type === 'copied' 
          ? 'The preloaded card has been copied and edited in your collection.'
          : 'Your flashcard has been updated successfully.',
        duration: 3000
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
    onError: (error) => {
      console.error('Error updating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the flashcard. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleEdit = useCallback((id: string, updatedCard: { question: string; answer: string }) => {
    editFlashcard.mutate({ id, updatedCard });
  }, [editFlashcard]);

  return {
    handleEdit,
    isEditing: editFlashcard.isPending
  };
}
