
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ConsensusRatingProps {
  consensusId: string;
  onRatingSubmit: (rating: number, comments?: string) => void;
}

export const ConsensusRating = ({
  consensusId,
  onRatingSubmit
}: ConsensusRatingProps) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const [comments, setComments] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  
  const { toast } = useToast();
  
  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };
  
  const handleSubmit = () => {
    if (selectedRating === null) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    onRatingSubmit(selectedRating, comments || undefined);
    setSubmitted(true);
    
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback on this consensus decision.",
    });
  };
  
  if (submitted) {
    return (
      <Card className="shadow-sm bg-muted/50">
        <CardContent className="pt-6 text-center">
          <p>Thank you for your feedback!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Rate this consensus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4 mb-4">
          <Button
            variant={selectedRating === 1 ? "default" : "outline"}
            size="lg"
            className={
              selectedRating === 1 
                ? "bg-green-500 hover:bg-green-600" 
                : "hover:bg-green-100"
            }
            onClick={() => handleRatingClick(1)}
          >
            <ThumbsUp className="h-5 w-5" />
            <span className="sr-only">Helpful</span>
          </Button>
          
          <Button
            variant={selectedRating === 0 ? "default" : "outline"}
            size="lg"
            className={
              selectedRating === 0 
                ? "bg-red-500 hover:bg-red-600" 
                : "hover:bg-red-100"
            }
            onClick={() => handleRatingClick(0)}
          >
            <ThumbsDown className="h-5 w-5" />
            <span className="sr-only">Not Helpful</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Any additional comments? (optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="resize-none"
            rows={3}
          />
          
          <Button 
            onClick={handleSubmit} 
            className="w-full"
          >
            Submit Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
