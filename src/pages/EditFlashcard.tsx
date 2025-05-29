
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FlashcardForm from '@/components/shared/flashcards/FlashcardForm';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject_area: string;
  difficulty: string;
  is_preloaded: boolean;
}

const EditFlashcard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcard = async () => {
      if (!id) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: 'Authentication required',
            description: 'You need to be logged in to edit flashcards',
            variant: 'destructive'
          });
          navigate('/flashcards');
          return;
        }

        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching flashcard:', error);
          toast({
            title: 'Error',
            description: 'Failed to load flashcard',
            variant: 'destructive'
          });
          navigate('/flashcards');
          return;
        }

        if (data.is_preloaded) {
          toast({
            title: 'Cannot edit',
            description: 'Preloaded flashcards cannot be edited',
            variant: 'destructive'
          });
          navigate('/flashcards');
          return;
        }

        setFlashcard(data);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
        navigate('/flashcards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcard();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: {
    question: string;
    answer: string;
    subject_area: string;
    difficulty: string;
  }) => {
    if (!id || !flashcard) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to edit flashcards',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('flashcards')
        .update({
          question: data.question,
          answer: data.answer,
          subject_area: data.subject_area,
          difficulty: data.difficulty,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Flashcard updated successfully!',
        duration: 3000
      });

      navigate('/flashcards');
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to update flashcard. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading flashcard...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!flashcard) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Flashcard not found</h2>
            <Button onClick={() => navigate('/flashcards')}>
              Return to Flashcards
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/flashcards')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Flashcards
          </Button>
          
          <h1 className="text-3xl font-bold">Edit Flashcard</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Your Flashcard</CardTitle>
            </CardHeader>
            <CardContent>
              <FlashcardForm 
                onSubmit={handleSubmit}
                initialData={{
                  question: flashcard.question,
                  answer: flashcard.answer,
                  subject_area: flashcard.subject_area,
                  difficulty: flashcard.difficulty
                }}
                isEditing
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditFlashcard;
