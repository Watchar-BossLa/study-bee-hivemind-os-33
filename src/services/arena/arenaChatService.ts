
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ChatMessage, TypingStatus } from '@/types/supabase-extensions';

// Result interfaces for our service methods
interface ServiceResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface MessagesResult extends ServiceResult<any> {
  messages?: ChatMessage[];
}

// Main service class
class ArenaChatService {
  private channels: Map<string, RealtimeChannel> = new Map();

  // Fetch chat messages for a match
  async fetchChatMessages(matchId: string): Promise<MessagesResult> {
    try {
      // Use type assertion to let TypeScript know we're accessing our extended table
      const { data, error } = await supabase
        .from('arena_chat_messages' as any)
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat messages:', error);
        return { success: false, message: error.message };
      }

      return {
        success: true,
        messages: data as unknown as ChatMessage[]
      };
    } catch (error) {
      console.error('Exception fetching chat messages:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  // Subscribe to new chat messages
  subscribeToChatMessages(
    matchId: string,
    onMessage: (message: ChatMessage) => void
  ): () => void {
    const channel = supabase
      .channel(`arena_chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'arena_chat_messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          onMessage(payload.new as unknown as ChatMessage);
        }
      )
      .subscribe();

    // Save the channel for cleanup
    this.channels.set(`chat:${matchId}`, channel);

    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
      this.channels.delete(`chat:${matchId}`);
    };
  }

  // Subscribe to typing indicators
  subscribeToTypingIndicators(
    matchId: string,
    onTypingChange: (typingStatuses: TypingStatus[]) => void
  ): () => void {
    // Create a channel for typing status updates
    const channel = supabase
      .channel(`arena_typing:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'arena_typing_status',
          filter: `match_id=eq.${matchId}`
        },
        async () => {
          // When any typing status changes, fetch all current typing statuses
          const { data } = await supabase
            .from('arena_typing_status' as any)
            .select('*')
            .eq('match_id', matchId);
          
          if (data) {
            onTypingChange(data as unknown as TypingStatus[]);
          }
        }
      )
      .subscribe();

    // Save the channel for cleanup
    this.channels.set(`typing:${matchId}`, channel);

    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
      this.channels.delete(`typing:${matchId}`);
    };
  }

  // Send a new message
  async sendMessage(matchId: string, userId: string, content: string): Promise<ServiceResult<any>> {
    try {
      const { error } = await supabase
        .from('arena_chat_messages' as any)
        .insert({
          match_id: matchId,
          user_id: userId,
          content: content
        });

      if (error) {
        console.error('Error sending message:', error);
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception sending message:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  // Update typing status
  async updateTypingStatus(matchId: string, userId: string, isTyping: boolean): Promise<ServiceResult<any>> {
    try {
      const { error } = await supabase
        .from('arena_typing_status' as any)
        .upsert({
          match_id: matchId,
          user_id: userId,
          is_typing: isTyping,
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating typing status:', error);
        return { success: false, message: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Exception updating typing status:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  // Clear typing status
  async clearTypingStatus(matchId: string, userId: string): Promise<ServiceResult<any>> {
    return this.updateTypingStatus(matchId, userId, false);
  }
}

// Export a singleton instance
export const arenaChatService = new ArenaChatService();
