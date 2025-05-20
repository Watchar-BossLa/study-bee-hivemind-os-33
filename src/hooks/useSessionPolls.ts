
import { useState, useEffect } from 'react';
import { usePollManagement } from './usePollManagement';
import { usePollResults } from './usePollResults';
import { usePollVoting } from './usePollVoting';

export function useSessionPolls(sessionId: string) {
  const {
    polls,
    activePoll,
    isLoading,
    fetchPolls,
    createPoll,
    endPoll
  } = usePollManagement(sessionId);

  const {
    pollResults,
    fetchPollResults,
    resetPollResults
  } = usePollResults();

  const {
    hasVoted,
    isVoting,
    checkUserVote,
    submitVote,
    resetVoteStatus
  } = usePollVoting(activePoll?.id || null);

  // Effect to fetch polls on mount
  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  // Effect to handle active poll changes
  useEffect(() => {
    const handleActivePollChange = async () => {
      if (activePoll) {
        await checkUserVote(activePoll.id);
        
        if (activePoll.options.length > 0) {
          await fetchPollResults(activePoll.id, activePoll.options.length);
        }
      } else {
        resetVoteStatus();
        resetPollResults();
      }
    };

    handleActivePollChange();
  }, [activePoll, checkUserVote, fetchPollResults]);

  // Function to handle vote submission and update results
  const handleSubmitVote = async (selectedOptions: number[]) => {
    if (!activePoll) return;
    
    const success = await submitVote(selectedOptions);
    
    if (success && activePoll) {
      await fetchPollResults(activePoll.id, activePoll.options.length);
    }
  };

  return {
    polls,
    activePoll,
    pollResults,
    isLoading,
    hasVoted,
    isVoting,
    createPoll,
    submitVote: handleSubmitVote,
    endPoll,
    refreshPolls: fetchPolls
  };
}
