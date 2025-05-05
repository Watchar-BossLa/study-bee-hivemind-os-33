import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaMatch, MatchPlayer } from '@/types/arena';
import { useMatchSubscription } from './arena/useMatchSubscription';
import { useMatchFetch } from './arena/useMatchFetch';
import { useMatchCreation } from './arena/useMatchCreation';
import { useMatchActions } from './arena/useMatchActions';

export const useArenaMatch = () => {
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [matchComplete, setMatchComplete] = useState(false);
  
  const { toast } = useToast();
  const { setupSubscription, clearSubscription } = useMatchSubscription();
  const { fetchMatch, fetchMatchPlayers } = useMatchFetch();
  const { createMatch, joinMatchAsPlayer, findWaitingMatch } = useMatchCreation();
  const { activateMatch, finishMatch: finishMatchAction } = useMatchActions();

  const updateMatchData = useCallback(async (matchId: string) => {
    const match = await fetchMatch(matchId);
    if (match) {
      setCurrentMatch(match);
    }
  }, [fetchMatch]);

  const updatePlayersData = useCallback(async (matchId: string) => {
    const matchPlayers = await fetchMatchPlayers(matchId);
    setPlayers(matchPlayers);
    
    // Check if we should activate the match when enough players have joined
    if (matchPlayers.length >= 2 && currentMatch?.status === 'waiting') {
      await activateMatch(matchId);
    }
  }, [fetchMatchPlayers, currentMatch, activateMatch]);

  const joinMatch = async (subjectFocus?: string | null): Promise<void> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // Find an existing match or create a new one
      let matchId = await findWaitingMatch(subjectFocus);
      
      if (!matchId) {
        matchId = await createMatch(subjectFocus);
        if (!matchId) throw new Error('Failed to create match');
      }

      // Join as a player
      const joined = await joinMatchAsPlayer(matchId, user.id);
      if (!joined) throw new Error('Failed to join match');

      // Set up subscriptions for real-time updates
      setupSubscription(
        matchId, 
        () => updatePlayersData(matchId),
        () => updateMatchData(matchId)
      );
      
      // Fetch initial data
      await updateMatchData(matchId);
      await updatePlayersData(matchId);
      
      const subjectMessage = subjectFocus ? 
        `Joined ${subjectFocus} match` : 
        "Joined match";
      
      toast({
        title: subjectMessage,
        description: "Waiting for other players...",
      });
    } catch (error) {
      toast({
        title: "Error joining match",
        description: "Failed to join match",
        variant: "destructive",
      });
    }
  };

  const finishMatch = async (): Promise<void> => {
    if (!currentMatch) return;
    
    try {
      const success = await finishMatchAction(currentMatch.id);
      if (success) {
        setMatchComplete(true);
      }
    } catch (error) {
      console.error('Error finishing match:', error);
    }
  };

  const leaveMatch = useCallback(() => {
    clearSubscription();
    setCurrentMatch(null);
    setPlayers([]);
    setMatchComplete(false);
    
    // Clear any chat or typing status - this will be handled in useArenaChat cleanup
    
  }, [clearSubscription]);

  return {
    currentMatch,
    players,
    matchComplete,
    joinMatch,
    finishMatch,
    leaveMatch
  };
};
