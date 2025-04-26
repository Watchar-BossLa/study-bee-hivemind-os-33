
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface OCRProcessingProps {
  state: 'idle' | 'capturing' | 'processing' | 'complete' | 'error';
  image: string | null;
  onReset: () => void;
}

const OCRProcessing: React.FC<OCRProcessingProps> = ({ state, image, onReset }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden bg-background border">
        {image && (
          <img src={image} alt="Captured text" className="w-full h-auto" />
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center py-4">
        {state === 'processing' && (
          <>
            <RotateCw className="h-5 w-5 animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Processing with AI...</p>
          </>
        )}
        
        {state === 'complete' && (
          <p className="text-sm text-green-600 font-medium">Processing complete!</p>
        )}
        
        {state === 'error' && (
          <p className="text-sm text-red-600 font-medium">Error processing image. Please try again.</p>
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
