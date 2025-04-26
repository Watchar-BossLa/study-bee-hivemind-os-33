
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OCRCamera from '@/components/ocr/OCRCamera';
import OCRProcessing from '@/components/ocr/OCRProcessing';
import { Button } from '@/components/ui/button';
import { Camera, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlashcardsList from '@/components/ocr/FlashcardsList';
import { useToast } from '@/components/ui/use-toast';

// Define the OCR processing states
type ProcessingState = 'idle' | 'capturing' | 'processing' | 'complete' | 'error';

const OCRFlashcards = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const { toast } = useToast();

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setProcessingState('processing');
    
    // Simulate OCR processing - in a real implementation, this would call the backend API
    setTimeout(() => {
      // Mock response - in production this would come from the backend Rust service
      const mockFlashcards = [
        { id: '1', question: 'What is the capital of France?', answer: 'Paris' },
        { id: '2', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
        { id: '3', question: 'What year was the Declaration of Independence signed?', answer: '1776' },
      ];
      
      setFlashcards([...flashcards, ...mockFlashcards]);
      setProcessingState('complete');
      toast({
        title: "Flashcards created!",
        description: `${mockFlashcards.length} new flashcards have been generated from your image.`,
      });
    }, 2000);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setProcessingState('idle');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">OCR Flashcards</h1>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Create Flashcards</h2>
              <p className="text-muted-foreground mb-4">
                Take a picture of your notes or textbook and automatically generate flashcards using our AI system.
              </p>
              
              {processingState === 'idle' ? (
                <OCRCamera onCapture={handleCapture} />
              ) : (
                <OCRProcessing 
                  state={processingState}
                  image={capturedImage}
                  onReset={handleReset}
                />
              )}
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Tips for best results:</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  <li>Ensure good lighting for clear text</li>
                  <li>Hold the camera steady to avoid blur</li>
                  <li>Position the text to fill the frame</li>
                  <li>Avoid shadows across the text</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Flashcards</TabsTrigger>
                  <TabsTrigger value="recent">Recently Added</TabsTrigger>
                  <TabsTrigger value="study">To Study</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <FlashcardsList flashcards={flashcards} />
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                <FlashcardsList flashcards={flashcards.slice(-3)} />
              </TabsContent>
              
              <TabsContent value="study" className="mt-0">
                <FlashcardsList flashcards={[]} emptyMessage="No flashcards scheduled for study today." />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OCRFlashcards;
