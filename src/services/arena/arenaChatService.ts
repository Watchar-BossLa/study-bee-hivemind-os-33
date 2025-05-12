
// This file now just re-exports from the modularized services
// It's kept for backward compatibility
import { arenaChatService } from './chat';
import type { ChatMessage, TypingStatus } from './chat/types';

export { arenaChatService };
export type { ChatMessage, TypingStatus };

// Re-export individual functions for direct use
export const {
  sendMessage: sendChatMessage,
  fetchChatMessages: getChatMessages,
  updateTypingStatus: setTypingStatus,
  getTypingStatuses,
  clearTypingStatus,
  subscribeToChatMessages,
  subscribeToTypingIndicators
} = arenaChatService;
