
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, TypingStatus } from '@/types/supabase-extensions';

/**
 * Send a new chat message for a match
 */
export async function sendChatMessage(
  matchId: string,
  userId: string,
  content: string
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('arena_chat_messages')
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

    return { success: true, message: data as ChatMessage };
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
    const { data, error } = await supabase
      .from('arena_chat_messages')
      .select()
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messages: data as ChatMessage[] };
  } catch (e) {
    console.error('Exception fetching chat messages:', e);
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Set typing status for a user in a match
 */
export async function setTypingStatus(
  matchId: string,
  userId: string,
  isTyping: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('arena_typing_status')
      .upsert({
        match_id: matchId,
        user_id: userId,
        is_typing: isTyping,
        last_updated: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating typing status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Exception updating typing status:', e);
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Get typing status for all users in a match
 */
export async function getTypingStatuses(
  matchId: string
): Promise<{ success: boolean; statuses?: TypingStatus[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('arena_typing_status')
      .select()
      .eq('match_id', matchId);

    if (error) {
      console.error('Error fetching typing statuses:', error);
      return { success: false, error: error.message };
    }

    return { success: true, statuses: data as TypingStatus[] };
  } catch (e) {
    console.error('Exception fetching typing statuses:', e);
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Clean up typing statuses when a user leaves
 */
export async function clearTypingStatus(
  matchId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('arena_typing_status')
      .delete()
      .eq('match_id', matchId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error clearing typing status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Exception clearing typing status:', e);
    return { success: false, error: (e as Error).message };
  }
}
