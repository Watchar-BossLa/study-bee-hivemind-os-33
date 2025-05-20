
import React, { useState } from 'react';
import { useSessionPolls } from '@/hooks/useSessionPolls';
import CreatePollForm from './CreatePollForm';
import { 
  ActivePoll, 
  CreatePollButton, 
  NoPollsMessage, 
  PollHistory 
} from './polls';

interface SessionPollProps {
  sessionId: string;
  isHost: boolean;
}

const SessionPoll: React.FC<SessionPollProps> = ({ sessionId, isHost }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
    polls,
    activePoll,
    pollResults,
    isLoading,
    hasVoted,
    isVoting,
    createPoll,
    submitVote,
    endPoll,
  } = useSessionPolls(sessionId);

  const handleCreatePoll = async (question: string, options: string[], allowMultipleChoices: boolean) => {
    await createPoll(question, options, allowMultipleChoices);
    setShowCreateForm(false);
  };
  
  const handleEndPoll = async () => {
    await endPoll();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-32 p-4">
        <p>Loading polls...</p>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6 p-4">
        <CreatePollForm 
          onSubmit={handleCreatePoll}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Show Create Poll button for hosts when no active poll */}
      {isHost && !activePoll && !showCreateForm && (
        <CreatePollButton onClick={() => setShowCreateForm(true)} />
      )}

      {/* Show active poll or no polls message */}
      {activePoll ? (
        <ActivePoll
          poll={activePoll}
          isHost={isHost}
          hasVoted={hasVoted}
          isVoting={isVoting}
          pollResults={pollResults}
          onEndPoll={handleEndPoll}
          onSubmitVote={submitVote}
        />
      ) : (
        <NoPollsMessage 
          isHost={isHost} 
          onCreatePoll={() => setShowCreateForm(true)} 
        />
      )}

      {/* Show poll history if there are previous polls */}
      {polls.length > 0 && !activePoll && (
        <PollHistory polls={polls} />
      )}
    </div>
  );
};

export default SessionPoll;
