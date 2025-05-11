
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { ChatMessage, TypingStatus } from '@/types/supabase-extensions';

// Define table names as constants to avoid repetition
const CHAT_MESSAGES_TABLE = 'arena_chat_messages';
const TYPING_STATUS_TABLE = 'arena_typing_status';

/**
 * Service for handling arena chat functionality and typing indicators
 */
export const arenaChatService = {
  /**
   * Subscribe to chat messages for a specific match
   * @param matchId The match ID to subscribe to
   * @param onMessage Callback function when a new message is received
   * @returns A function to unsubscribe
   */
  subscribeToChatMessages: (
    matchId: string,
    onMessage: (message: ChatMessage) => void
  ): (() => void) => {
    const channel = supabase.channel(`chat_${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: CHAT_MESSAGES_TABLE,
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        onMessage(payload.new as ChatMessage);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to typing indicators for a specific match
   * @param matchId The match ID to subscribe to
   * @param onTypingChange Callback function when typing status changes
   * @returns A function to unsubscribe
   */
  subscribeToTypingIndicators: (
    matchId: string,
    onTypingChange: (typingStatus: TypingStatus[]) => void
  ): (() => void) => {
    const channel = supabase.channel(`typing_${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: TYPING_STATUS_TABLE,
        filter: `match_id=eq.${matchId}`
      }, async () => {
        // Fetch the current typing status data
        const { data, error } = await supabase
          .from(TYPING_STATUS_TABLE)
          .select('*')
          .eq('match_id', matchId);
        
        if (data && !error) {
          onTypingChange(data as TypingStatus[]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Send a chat message to a match
   * @param matchId The match ID
   * @param userId The user ID sending the message
   * @param content The message content
   * @returns A promise that resolves when the message is sent
   */
  sendMessage: async (
    matchId: string,
    userId: string,
    content: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(CHAT_MESSAGES_TABLE)
        .insert({
          match_id: matchId,
          user_id: userId,
          content: content
        });

      return !error;
    } catch (error) {
      console.error('Error sending chat message:', error);
      return false;
    }
  },

  /**
   * Update the user's typing status
   * @param matchId The match ID
   * @param userId The user ID
   * @param isTyping Whether the user is currently typing
   * @returns A promise that resolves when the status is updated
   */
  updateTypingStatus: async (
    matchId: string,
    userId: string,
    isTyping: boolean
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(TYPING_STATUS_TABLE)
        .upsert({
          match_id: matchId,
          user_id: userId,
          is_typing: isTyping,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id, match_id'
        });

      return !error;
    } catch (error) {
      console.error('Error updating typing status:', error);
      return false;
    }
  },
  
  /**
   * Clear typing status when a user leaves a match
   * @param matchId The match ID
   * @param userId The user ID
   */
  clearTypingStatus: async (matchId: string, userId: string): Promise<void> => {
    try {
      await supabase
        .from(TYPING_STATUS_TABLE)
        .delete()
        .eq('match_id', matchId)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error clearing typing status:', error);
    }
  },

  /**
   * Fetch chat messages for a match
   * @param matchId The match ID
   * @returns A promise that resolves with the messages
   */
  fetchChatMessages: async (matchId: string): Promise<ChatMessage[]> => {
    try {
      const { data, error } = await supabase
        .from(CHAT_MESSAGES_TABLE)
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (error) {
        throw error;
      }
      
      return data as ChatMessage[];
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  }
};
