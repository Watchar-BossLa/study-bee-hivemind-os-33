
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './types';

/**
 * Send a new chat message for a match
 */
export async function sendChatMessage(
  matchId: string,
  userId: string,
  content: string
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  try {
    // Use explicit casting for our custom table
    const { data, error } = await supabase
      .from('arena_chat_messages' as any)
      .insert({
        match_id: matchId,
        user_id: userId,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending chat message:', error);
      return { success: false, error: error.message };
    }

    return { success: true, message: data as unknown as ChatMessage };
  } catch (e) {
    console.error('Exception sending chat message:', e);
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Fetch chat messages for a match
 */
export async function getChatMessages(
  matchId: string
): Promise<{ success: boolean; messages?: ChatMessage[]; error?: string }> {
  try {
    // Use explicit casting for our custom table
    const { data, error } = await supabase
      .from('arena_chat_messages' as any)
      .select()
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messages: data as unknown as ChatMessage[] };
  } catch (e) {
    console.error('Exception fetching chat messages:', e);
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Subscribe to chat message updates for a match
 */
export function subscribeToChatMessages(
  matchId: string, 
  callback: (message: ChatMessage) => void
): () => void {
  const channel = supabase
    .channel('arena-chat-updates')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'arena_chat_messages',
        filter: `match_id=eq.${matchId}`
      },
      (payload) => {
        callback(payload.new as unknown as ChatMessage);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}
