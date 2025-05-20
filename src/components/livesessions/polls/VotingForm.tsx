
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SessionPoll } from '@/types/livesessions';

interface VotingFormProps {
  poll: SessionPoll;
  isVoting: boolean;
  onSubmitVote: (selectedOptions: number[]) => Promise<void>;
}

const VotingForm: React.FC<VotingFormProps> = ({ 
  poll, 
  isVoting, 
  onSubmitVote 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionToggle = (optionIndex: number) => {
    if (selectedOptions.includes(optionIndex)) {
      setSelectedOptions(selectedOptions.filter(index => index !== optionIndex));
    } else {
      if (poll.allowMultipleChoices) {
        setSelectedOptions([...selectedOptions, optionIndex]);
      } else {
        setSelectedOptions([optionIndex]);
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) return;
    await onSubmitVote(selectedOptions);
    setSelectedOptions([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {poll.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${index}`}
              checked={selectedOptions.includes(index)}
              onCheckedChange={() => handleOptionToggle(index)}
            />
            <label 
              htmlFor={`option-${index}`}
              className="text-sm cursor-pointer"
            >
              {option.text}
            </label>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={selectedOptions.length === 0 || isVoting}
      >
        {isVoting ? 'Submitting...' : 'Submit Vote'}
      </Button>
    </div>
  );
};

export default VotingForm;
