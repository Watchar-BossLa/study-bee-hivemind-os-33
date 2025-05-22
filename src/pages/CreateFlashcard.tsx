
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SUBJECTS, DIFFICULTIES, capitalizeFirst } from '@/utils/subjectConstants';

const CreateFlashcard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flashcard, setFlashcard] = useState({
    question: '',
    answer: '',
    subject_area: 'general',
    difficulty: 'beginner'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFlashcard(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFlashcard(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flashcard.question || !flashcard.answer) {
      toast({
        title: 'Missing fields',
        description: 'Please provide both a question and answer',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to create flashcards',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Insert new flashcard
      const { error } = await supabase.from('flashcards').insert({
        user_id: user.id,
        question: flashcard.question,
        answer: flashcard.answer,
        subject_area: flashcard.subject_area,
        difficulty: flashcard.difficulty,
        is_preloaded: false
      });
      
      if (error) throw error;
      
      toast({
        title: 'Success!',
        description: 'Your flashcard has been created',
        duration: 3000
      });
      
      // Reset form or navigate back to flashcards page
      navigate('/flashcards');
      
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: 'Error',
        description: 'Failed to create flashcard. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container max-w-4xl mx-auto px-4 py-8 flex-grow">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/flashcards')} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold">Create New Flashcard</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Flashcard Details</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject_area">Subject</Label>
                    <Select 
                      value={flashcard.subject_area} 
                      onValueChange={(value) => handleSelectChange('subject_area', value)}
                    >
                      <SelectTrigger id="subject_area">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(subject => (
                          <SelectItem key={subject} value={subject}>
                            {capitalizeFirst(subject)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={flashcard.difficulty} 
                      onValueChange={(value) => handleSelectChange('difficulty', value)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map(level => (
                          <SelectItem key={level} value={level}>
                            {capitalizeFirst(level)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    name="question"
                    placeholder="Enter your question"
                    className="min-h-[100px]"
                    value={flashcard.question}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    name="answer"
                    placeholder="Enter the answer"
                    className="min-h-[120px]"
                    value={flashcard.answer}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/flashcards')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Flashcard
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateFlashcard;
