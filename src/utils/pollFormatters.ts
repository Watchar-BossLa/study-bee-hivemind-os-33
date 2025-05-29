
import { SessionPoll, PollOption } from '@/types/livesessions';

export function formatPollData(pollData: any): SessionPoll {
  // Ensure options have the correct structure
  const formattedOptions: PollOption[] = (pollData.options || []).map((option: any, index: number) => ({
    id: option.id || index.toString(),
    text: option.text || '',
    votes: option.votes || 0
  }));

  return {
    id: pollData.id,
    sessionId: pollData.session_id,
    creatorId: pollData.creator_id,
    question: pollData.question,
    options: formattedOptions,
    allowMultipleChoices: pollData.allow_multiple_choices,
    isActive: pollData.is_active,
    createdAt: pollData.created_at,
    endedAt: pollData.ended_at
  };
}

export function formatPollOptionsForDb(options: string[]): { text: string; id: string; votes: number }[] {
  return options.map((text, index) => ({
    id: index.toString(),
    text,
    votes: 0
  }));
}
