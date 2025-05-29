
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FlashcardForm from '@/components/shared/flashcards/FlashcardForm';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CreateFlashcard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: {
    question: string;
    answer: string;
    subject_area: string;
    difficulty: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to create flashcards',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('flashcards')
        .insert({
          user_id: user.id,
          question: data.question,
          answer: data.answer,
          subject_area: data.subject_area,
          difficulty: data.difficulty
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Flashcard created successfully!',
        duration: 3000
      });

      navigate('/flashcards');
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to create flashcard. Please try again.',
        variant: 'destructive'
      });
    }
  };

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
          
          <h1 className="text-3xl font-bold">Create New Flashcard</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add a New Flashcard</CardTitle>
            </CardHeader>
            <CardContent>
              <FlashcardForm onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateFlashcard;
