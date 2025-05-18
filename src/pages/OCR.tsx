
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OCRCamera from '@/components/ocr/OCRCamera';
import { useToast } from '@/hooks/use-toast';

const OCR = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleCapture = (uploadId: string) => {
    setProcessingId(uploadId);
    
    // In a real application, you would navigate to a results page or show processing state
    toast({
      title: "Image captured successfully",
      description: "Processing your image. This may take a moment.",
    });
    
    // Simulate processing and redirect to flashcards page
    setTimeout(() => {
      navigate('/flashcards');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Create Flashcards with OCR</h1>
        
        {processingId ? (
          <div className="p-8 text-center">
            <div className="animate-pulse mb-4">Processing your image...</div>
            <p className="text-muted-foreground">You will be redirected when complete.</p>
          </div>
        ) : (
          <OCRCamera onCapture={handleCapture} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OCR;
