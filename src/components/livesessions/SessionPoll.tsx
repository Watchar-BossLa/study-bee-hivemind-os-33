
import React, { useState } from 'react';
import { useSessionPolls } from '@/hooks/useSessionPolls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PieChart } from 'lucide-react';
import CreatePollForm from './CreatePollForm';

interface SessionPollProps {
  sessionId: string;
  isHost: boolean;
}

const SessionPoll: React.FC<SessionPollProps> = ({ sessionId, isHost }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  
  const {
    polls,
    activePoll,
    pollResults,
    isLoading,
    hasVoted,
    createPoll,
    submitVote,
    endPoll,
    refreshPolls
  } = useSessionPolls(sessionId);

  const handleOptionToggle = (optionIndex: number) => {
    if (selectedOptions.includes(optionIndex)) {
      setSelectedOptions(selectedOptions.filter(index => index !== optionIndex));
    } else {
      if (activePoll?.allowMultipleChoices) {
        setSelectedOptions([...selectedOptions, optionIndex]);
      } else {
        setSelectedOptions([optionIndex]);
      }
    }
  };

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) return;
    
    await submitVote(selectedOptions);
    setSelectedOptions([]);
  };

  const handleCreatePoll = async (question: string, options: string[], allowMultipleChoices: boolean) => {
    await createPoll(question, options, allowMultipleChoices);
  };
  
  const handleEndPoll = async () => {
    await endPoll();
  };

  return (
    <div className="space-y-6 p-4">
      {isHost && !activePoll && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Create a Poll</h3>
          <CreatePollForm onPollCreated={handleCreatePoll} />
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-32">
          <p>Loading polls...</p>
        </div>
      ) : activePoll ? (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{activePoll.question}</h3>
            {isHost && (
              <Button variant="outline" onClick={handleEndPoll}>
                End Poll
              </Button>
            )}
          </div>
          
          {hasVoted ? (
            <div className="space-y-3">
              <Alert>
                <AlertDescription>
                  You have already voted in this poll. Results are shown below.
                </AlertDescription>
              </Alert>
              
              {pollResults && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {pollResults.totalResponses} response{pollResults.totalResponses !== 1 ? 's' : ''}
                  </p>
                  
                  {activePoll.options.map((option, index) => {
                    const votes = pollResults.optionCounts[index] || 0;
                    const percentage = pollResults.totalResponses > 0 
                      ? Math.round((votes / pollResults.totalResponses) * 100) 
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
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {activePoll.options.map((option, index) => (
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
              
              <Button onClick={handleSubmitVote} disabled={selectedOptions.length === 0}>
                Submit Vote
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center h-32">
          <PieChart className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No active polls right now.</p>
          {isHost && (
            <Button variant="link" onClick={refreshPolls}>
              Create a poll to gather feedback
            </Button>
          )}
        </div>
      )}

      {polls.length > 0 && !activePoll && (
        <Card className="p-4 mt-4">
          <h3 className="text-lg font-medium mb-2">Previous Polls</h3>
          <div className="space-y-2">
            {polls.filter(p => !p.isActive).map(poll => (
              <div key={poll.id} className="p-2 border rounded">
                <h4 className="font-medium">{poll.question}</h4>
                <p className="text-xs text-muted-foreground">
                  Ended: {new Date(poll.endedAt || poll.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SessionPoll;
