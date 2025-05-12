
import { sendChatMessage, getChatMessages, subscribeToChatMessages } from './chatMessageService';
import { 
  setTypingStatus, 
  getTypingStatuses,
  clearTypingStatus, 
  subscribeToTypingIndicators 
} from './typingStatusService';
import { ChatMessage, TypingStatus } from './types';

// Create a service object for easier importing and use in other files
export const arenaChatService = {
  // Chat message methods
  sendMessage: sendChatMessage,
  fetchChatMessages: getChatMessages,
  subscribeToChatMessages,
  
  // Typing status methods
  updateTypingStatus: setTypingStatus,
  getTypingStatuses,
  clearTypingStatus,
  subscribeToTypingIndicators
};

// Export types from this file for convenience
export type { ChatMessage, TypingStatus };
