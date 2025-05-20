
import { SessionPoll, PollResults } from '@/types/livesessions';

/**
 * Formats raw poll options data into the required format
 */
export const formatPollOptions = (options: any): { text: string }[] => {
  let formattedOptions: { text: string }[] = [];
  
  try {
    if (Array.isArray(options)) {
      // If it's already an array, make sure each item has the correct format
      formattedOptions = options.map((opt: any) => {
        if (typeof opt === 'string') {
          return { text: opt };
        } else if (typeof opt === 'object' && opt !== null && 'text' in opt) {
          return { text: String(opt.text) };
        } else {
          return { text: String(opt) };
        }
      });
    } else if (typeof options === 'object' && options !== null) {
      // Handle case where options might be an object with numeric keys
      formattedOptions = Object.values(options).map((opt: any) => {
        if (typeof opt === 'string') {
          return { text: opt };
        } else if (typeof opt === 'object' && opt !== null && 'text' in opt) {
          return { text: String(opt.text) };
        } else {
          return { text: String(opt) };
        }
      });
    }
  } catch (err) {
    console.error("Error formatting poll options:", err);
    formattedOptions = [{ text: "Error loading options" }];
  }

  return formattedOptions;
};

/**
 * Transforms database poll data to match the SessionPoll type
 */
export const formatPollData = (pollData: any): SessionPoll => {
  return {
    id: pollData.id,
    sessionId: pollData.session_id,
    creatorId: pollData.creator_id,
    question: pollData.question,
    options: formatPollOptions(pollData.options),
    isActive: pollData.is_active,
    allowMultipleChoices: pollData.allow_multiple_choices,
    createdAt: pollData.created_at,
    endedAt: pollData.ended_at || undefined
  };
};

/**
 * Calculate retention rate percentage
 */
export const calculateRetentionRate = (totalReviews: number, correctReviews: number): number => {
  if (totalReviews === 0) return 0;
  return Math.round((correctReviews / totalReviews) * 100);
};
