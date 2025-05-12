
import { supabase } from '@/integrations/supabase/client';
import { TypingStatus } from './types';

/**
 * Set typing status for a user in a match
 */
export async function setTypingStatus(
  matchId: string,
  userId: string,
  isTyping: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use explicit casting for our custom table
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
    // Use explicit casting for our custom table
    const { data, error } = await supabase
      .from('arena_typing_status' as any)
      .select()
      .eq('match_id', matchId);

    if (error) {
      console.error('Error fetching typing statuses:', error);
      return { success: false, error: error.message };
    }

    return { success: true, statuses: data as unknown as TypingStatus[] };
  } catch (e) {
    console.error('Exception fetching typing statuses:', e);
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Clean up typing status when a user leaves
 */
export async function clearTypingStatus(
  matchId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use explicit casting for our custom table
    const { error } = await supabase
      .from('arena_typing_status' as any)
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

/**
 * Subscribe to typing status updates for a match
 */
export function subscribeToTypingIndicators(
  matchId: string, 
  callback: (statuses: TypingStatus[]) => void
): () => void {
  const channel = supabase
    .channel('arena-typing-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'arena_typing_status',
        filter: `match_id=eq.${matchId}`
      },
      async () => {
        // When typing status changes, fetch all typing statuses
        const { success, statuses } = await getTypingStatuses(matchId);
        if (success && statuses) {
          callback(statuses);
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}
