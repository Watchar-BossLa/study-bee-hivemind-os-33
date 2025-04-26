
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OCRProcessingProps {
  state: 'idle' | 'capturing' | 'processing' | 'complete' | 'error';
  image: string | null;
  onReset: () => void;
  processingSteps?: string[];
}

const OCRProcessing: React.FC<OCRProcessingProps> = ({ 
  state, 
  image, 
  onReset,
  processingSteps = ['Analyzing image', 'Extracting text', 'Deskewing content', 'Creating flashcards'] 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (state === 'processing') {
      const stepInterval = 100 / processingSteps.length;
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < processingSteps.length - 1) {
            setProgressValue((prev + 1) * stepInterval);
            return prev + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 700);

      return () => clearInterval(timer);
    } else if (state === 'complete') {
      setProgressValue(100);
    }
  }, [state, processingSteps.length]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-background border">
        {image && (
          <img src={image} alt="Captured text" className="w-full h-auto" />
        )}
        {state === 'processing' && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <RotateCw className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p className="text-sm font-medium text-center mb-2">{processingSteps[currentStep]}</p>
            <div className="w-full max-w-xs">
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center py-4">
        {state === 'complete' && (
          <div className="flex items-center text-green-600 mb-2">
            <Check className="h-5 w-5 mr-1" />
            <p className="text-sm font-medium">Processing complete!</p>
          </div>
        )}
        
        {state === 'error' && (
          <div className="flex items-center text-red-600 mb-2">
            <X className="h-5 w-5 mr-1" />
            <p className="text-sm font-medium">Error processing image. Please try again.</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onReset} variant="outline">
          Take Another Photo
        </Button>
      </div>
    </div>
  );
};

export default OCRProcessing;
