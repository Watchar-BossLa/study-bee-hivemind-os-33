
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';

interface FlashcardEditFormProps {
  question: string;
  answer: string;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: 'question' | 'answer', value: string) => void;
}

const FlashcardEditForm: React.FC<FlashcardEditFormProps> = ({
  question,
  answer,
  onSave,
  onCancel,
  onChange,
}) => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="question">Question</Label>
          <Input 
            id="question"
            value={question}
            onChange={(e) => onChange('question', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="answer">Answer</Label>
          <Input 
            id="answer"
            value={answer}
            onChange={(e) => onChange('answer', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCancel}
        >
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={onSave}
        >
          <Check className="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default FlashcardEditForm;
