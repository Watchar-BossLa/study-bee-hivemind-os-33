
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SessionPoll, PollResults as PollResultsType } from '@/types/livesessions';
import VotingForm from './VotingForm';
import PollResults from './PollResults';

interface ActivePollProps {
  poll: SessionPoll;
  isHost: boolean;
  hasVoted: boolean;
  isVoting: boolean;
  pollResults: PollResultsType | null;
  onEndPoll: () => Promise<void>;
  onSubmitVote: (selectedOptions: number[]) => Promise<void>;
}

const ActivePoll: React.FC<ActivePollProps> = ({
  poll,
  isHost,
  hasVoted,
  isVoting,
  pollResults,
  onEndPoll,
  onSubmitVote
}) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{poll.question}</h3>
        {isHost && (
          <Button variant="outline" onClick={onEndPoll}>
            End Poll
          </Button>
        )}
      </div>
      
      {hasVoted ? (
        <PollResults poll={poll} results={pollResults} />
      ) : (
        <VotingForm poll={poll} isVoting={isVoting} onSubmitVote={onSubmitVote} />
      )}
    </Card>
  );
};

export default ActivePoll;
