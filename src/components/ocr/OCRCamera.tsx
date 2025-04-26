
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OCRCameraProps {
  onCapture: (imageSrc: string) => void;
}

const OCRCamera: React.FC<OCRCameraProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 } 
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions and try again.");
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check your permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
          // Set canvas dimensions to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Get base64 image data
          const imageSrc = canvas.toDataURL('image/png');
          
          // Pass image to parent component
          onCapture(imageSrc);
          
          // Stop camera
          stopCamera();
        }
      } catch (err) {
        console.error("Error capturing image:", err);
        toast({
          title: "Capture Error",
          description: "Failed to capture image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
        {!isStreamActive && !isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
          </div>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <Camera className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Accessing camera...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <X className="h-12 w-12 text-red-500 mb-2" />
            <p className="text-sm text-center text-red-500">{error}</p>
          </div>
        )}
        
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          className={`w-full h-full object-cover ${!isStreamActive ? 'hidden' : ''}`}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {!isStreamActive ? (
        <Button 
          onClick={startCamera} 
          className="w-full"
          disabled={isLoading}
        >
          <Camera className="mr-2 h-4 w-4" />
          {isLoading ? 'Starting Camera...' : 'Start Camera'}
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={stopCamera}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={captureImage}>
            <Image className="mr-1 h-4 w-4" />
            Capture
          </Button>
        </div>
      )}
    </div>
  );
};

export default OCRCamera;
