
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaMatch, MatchPlayer } from '@/types/arena';

/**
 * Hook for handling match subscriptions via Supabase Realtime
 */
export const useMatchSubscription = () => {
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(() => null);

  const subscribeToMatch = useCallback((matchId: string): (() => void) => {
    const playersChannel = supabase.channel(`match_players_${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_players',
        filter: `match_id=eq.${matchId}`,
      }, () => {
        // This will be provided by the parent hook
      })
      .subscribe();

    const matchChannel = supabase.channel(`arena_match_${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'arena_matches',
        filter: `id=eq.${matchId}`,
      }, () => {
        // This will be provided by the parent hook
      })
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(matchChannel);
    };
  }, []);

  const setupSubscription = useCallback((matchId: string, onPlayersChange: () => void, onMatchChange: () => void) => {
    const unsub = subscribeToMatch(matchId);
    setUnsubscribe(() => unsub);
    return unsub;
  }, [subscribeToMatch]);

  const clearSubscription = useCallback(() => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(() => null);
    }
  }, [unsubscribe]);

  return {
    setupSubscription,
    clearSubscription
  };
};
