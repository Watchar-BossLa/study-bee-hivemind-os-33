
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

interface ResponseButtonsProps {
  isSubmitting: boolean;
  onResponse: (wasCorrect: boolean) => Promise<void>;
}

const ResponseButtons: React.FC<ResponseButtonsProps> = ({ isSubmitting, onResponse }) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => onResponse(false)}
        disabled={isSubmitting}
      >
        <X className="mr-2 h-4 w-4" />
        Incorrect
      </Button>
      <Button
        className="flex-1"
        onClick={() => onResponse(true)}
        disabled={isSubmitting}
      >
        <Check className="mr-2 h-4 w-4" />
        Correct
      </Button>
    </div>
  );
};

export default ResponseButtons;
