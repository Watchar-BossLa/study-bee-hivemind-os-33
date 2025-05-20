
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';

export interface PollFormProps {
  onSubmit: (question: string, options: string[], allowMultipleChoices: boolean) => Promise<void>;
  onCancel: () => void;
}

const CreatePollForm: React.FC<PollFormProps> = ({ onSubmit, onCancel }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [allowMultipleChoices, setAllowMultipleChoices] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Validate
    if (!question.trim()) {
      setErrorMessage('Please enter a question');
      return;
    }
    
    if (options.some(opt => !opt.trim())) {
      setErrorMessage('All options must have text');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(question, options, allowMultipleChoices);
    } catch (err) {
      setErrorMessage('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          placeholder="Enter your poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Poll Options</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addOption}
            disabled={options.length >= 10 || isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>
        
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              disabled={isSubmitting}
              required
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => removeOption(index)}
              disabled={options.length <= 2 || isSubmitting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="multipleChoice"
          checked={allowMultipleChoices}
          onCheckedChange={setAllowMultipleChoices}
          disabled={isSubmitting}
        />
        <Label htmlFor="multipleChoice">Allow multiple choices</Label>
      </div>
      
      {errorMessage && (
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
        </Button>
      </div>
    </form>
  );
};

export default CreatePollForm;
