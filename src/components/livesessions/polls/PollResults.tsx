
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { SessionPoll, PollResults as PollResultsType } from '@/types/livesessions';

interface PollResultsProps {
  poll: SessionPoll;
  results: PollResultsType | null;
}

const PollResults: React.FC<PollResultsProps> = ({ poll, results }) => {
  if (!results) return null;

  return (
    <div className="space-y-3">
      <Alert>
        <AlertDescription>
          You have already voted in this poll. Results are shown below.
        </AlertDescription>
      </Alert>
      
      <div className="mt-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          {results.totalResponses} response{results.totalResponses !== 1 ? 's' : ''}
        </p>
        
        {poll.options.map((option, index) => {
          const votes = results.optionCounts[index] || 0;
          const percentage = results.totalResponses > 0 
            ? Math.round((votes / results.totalResponses) * 100) 
            : 0;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{option.text}</span>
                <span>{votes} ({percentage}%)</span>
              </div>
              <Progress value={percentage} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollResults;
