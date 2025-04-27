import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OCRCamera from '@/components/ocr/OCRCamera';
import OCRProcessing from '@/components/ocr/OCRProcessing';
import FlashcardsList from '@/components/ocr/FlashcardsList';
import { Button } from '@/components/ui/button';
import { Camera, ArrowLeft, BrainCircuit, RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type ProcessingState = 'idle' | 'capturing' | 'processing' | 'complete' | 'error';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  last_reviewed?: string;
  easiness_factor?: number;
  interval?: number;
  repetition?: number;
}

const OCRFlashcards = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isImportingFromDevice, setIsImportingFromDevice] = useState(false);
  const { toast } = useToast();

  const processImage = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setProcessingState('processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockFlashcards: Flashcard[] = [
        { 
          id: Date.now().toString() + '-1', 
          question: 'What is the capital of France?', 
          answer: 'Paris',
          created_at: new Date().toISOString(),
          easiness_factor: 2.5,
          interval: 1,
          repetition: 0
        },
        { 
          id: Date.now().toString() + '-2', 
          question: 'What is the powerhouse of the cell?', 
          answer: 'Mitochondria',
          created_at: new Date().toISOString(),
          easiness_factor: 2.5,
          interval: 1,
          repetition: 0
        },
        { 
          id: Date.now().toString() + '-3', 
          question: 'What year was the Declaration of Independence signed?', 
          answer: '1776',
          created_at: new Date().toISOString(),
          easiness_factor: 2.5,
          interval: 1,
          repetition: 0
        },
      ];
      
      setFlashcards(prevCards => [...prevCards, ...mockFlashcards]);
      setProcessingState('complete');
      
      toast({
        title: "Flashcards created!",
        description: `${mockFlashcards.length} new flashcards have been generated from your image.`,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      setProcessingState('error');
      toast({
        title: "Processing failed",
        description: "There was an error creating flashcards from your image.",
        variant: "destructive",
      });
    }
  };

  const handleCapture = (imageSrc: string) => {
    processImage(imageSrc);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setProcessingState('idle');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsImportingFromDevice(true);
    
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          processImage(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Import failed",
        description: "There was an error importing your image.",
        variant: "destructive",
      });
    } finally {
      setIsImportingFromDevice(false);
    }
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
          <div>
            <h1 className="text-3xl font-bold">OCR Flashcards</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Capture text and automatically create flashcards with AI
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-card rounded-lg shadow-sm p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Create Flashcards</h2>
                <Badge variant="outline" className="flex items-center">
                  <BrainCircuit className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">
                Take a picture of your notes or textbook and let our AI system automatically generate flashcards.
              </p>
              
              {processingState === 'idle' ? (
                <>
                  <OCRCamera onCapture={handleCapture} />
                  
                  <div className="relative mt-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or import from device
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full border border-dashed rounded-md p-4 text-center hover:bg-muted/50 transition-colors">
                        {isImportingFromDevice ? (
                          <div className="flex items-center">
                            <RotateCw className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm">Importing...</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Click to select an image
                          </span>
                        )}
                      </div>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isImportingFromDevice}
                      />
                    </label>
                  </div>
                </>
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
                  <li>Crop unnecessary margins if possible</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Flashcards</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="study">To Study</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{flashcards.length} flashcards total</span>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <FlashcardsList flashcards={flashcards} />
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                <FlashcardsList 
                  flashcards={flashcards
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                  }
                />
              </TabsContent>
              
              <TabsContent value="study" className="mt-0">
                <FlashcardsList 
                  flashcards={[]}
                  emptyMessage="No flashcards scheduled for study today. Use the SM-2⁺ algorithm to optimize your learning."
                />
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
