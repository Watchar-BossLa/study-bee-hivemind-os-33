
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export type ChatMessage = {
  id: string;
  match_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type TypingStatus = {
  user_id: string;
  match_id: string;
  is_typing: boolean;
  last_updated: string;
};

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
        table: 'arena_chat_messages',
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
        table: 'arena_typing_status',
        filter: `match_id=eq.${matchId}`
      }, async () => {
        // Query for all current typing statuses when any change occurs
        const { data } = await supabase
          .rpc('get_typing_status', { match_id_param: matchId });
        
        if (data) {
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
        .rpc('insert_chat_message', {
          match_id_param: matchId,
          user_id_param: userId,
          content_param: content
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
        .rpc('update_typing_status', {
          match_id_param: matchId,
          user_id_param: userId,
          is_typing_param: isTyping
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
        .rpc('delete_typing_status', {
          match_id_param: matchId,
          user_id_param: userId
        });
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
        .rpc('get_chat_messages', { match_id_param: matchId });
      
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
