import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useArenaStats } from './useArenaStats';
import { useArenaAchievements } from './useArenaAchievements';
import { calculateScore } from '@/utils/arenaUtils';
import type { ArenaMatch, MatchPlayer, QuizQuestion } from '@/types/arena';

export const useArena = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [matchComplete, setMatchComplete] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<() => void | null>(() => null);
  
  const { toast } = useToast();
  const { arenaStats, leaderboard, fetchUserStats, fetchLeaderboard } = useArenaStats();
  const { achievements, fetchAchievements, awardAchievement } = useArenaAchievements();

  const joinMatch = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      let { data: existingMatch } = await supabase
        .from('arena_matches')
        .select()
        .eq('status', 'waiting')
        .single();

      let matchId: string;

      if (!existingMatch) {
        const { data: newMatch, error: createError } = await supabase
          .from('arena_matches')
          .insert({ status: 'waiting' })
          .select()
          .single();

        if (createError) throw createError;
        matchId = newMatch.id;
      } else {
        matchId = existingMatch.id;
      }

      const { error: joinError } = await supabase
        .from('match_players')
        .insert({ match_id: matchId, user_id: user.id });

      if (joinError) throw joinError;

      const unsub = subscribeToMatch(matchId);
      setUnsubscribe(() => unsub);
      
      toast({
        title: "Joined match",
        description: "Waiting for other players...",
      });

      checkFirstMatchAchievement(user.id);
    } catch (error) {
      toast({
        title: "Error joining match",
        description: "Failed to join match",
        variant: "destructive",
      });
    }
  };

  const startMatch = useCallback(async (matchId: string) => {
    try {
      const { data: questionData } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at')
        .limit(5);

      if (questionData) {
        const typedQuestions: QuizQuestion[] = questionData.map(q => ({
          id: q.id,
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer as 'a' | 'b' | 'c' | 'd',
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
          category: q.category
        }));
        
        setQuestions(typedQuestions);
        
        await supabase
          .from('arena_matches')
          .update({ 
            status: 'active',
            start_time: new Date().toISOString()
          })
          .eq('id', matchId);
      }
    } catch (error) {
      console.error('Error starting match:', error);
    }
  }, []);

  const answerQuestion = async (answer: 'a' | 'b' | 'c' | 'd') => {
    if (!currentMatch || selectedAnswer || currentQuestionIndex >= questions.length) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const scoreToAdd = isCorrect ? calculateScore(currentQuestion.difficulty) : 0;
      
      await supabase.rpc('update_player_progress', {
        match_id_param: currentMatch.id,
        user_id_param: user.id,
        score_to_add: scoreToAdd,
        is_correct: isCorrect
      });

      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setTimeLeft(15);
        } else {
          finishMatch();
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const finishMatch = async () => {
    if (!currentMatch) return;
    
    try {
      await supabase
        .from('arena_matches')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', currentMatch.id);
      
      setMatchComplete(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        checkForAchievements(user.id, currentMatch.id);
      }
      
      fetchUserStats();
      fetchLeaderboard();
    } catch (error) {
      console.error('Error finishing match:', error);
    }
  };

  const subscribeToMatch = (matchId: string) => {
    const playersChannel = supabase.channel(`match_players_${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_players',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        fetchMatchPlayers(matchId);
      })
      .subscribe();

    const matchChannel = supabase.channel(`arena_match_${matchId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'arena_matches',
        filter: `id=eq.${matchId}`,
      }, (payload) => {
        fetchMatch(matchId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
      supabase.removeChannel(matchChannel);
    };
  };

  const fetchMatch = async (matchId: string) => {
    const { data } = await supabase
      .from('arena_matches')
      .select()
      .eq('id', matchId)
      .single();
    
    if (data) {
      const typedMatch: ArenaMatch = {
        id: data.id,
        status: data.status as 'waiting' | 'active' | 'completed',
        start_time: data.start_time,
        end_time: data.end_time
      };
      
      setCurrentMatch(typedMatch);
      
      if (data.status === 'active' && questions.length === 0) {
        startMatch(matchId);
      }
    }
  };

  const fetchMatchPlayers = async (matchId: string) => {
    const { data } = await supabase
      .from('match_players')
      .select()
      .eq('match_id', matchId);
    
    if (data) {
      setPlayers(data);
      
      if (data.length >= 2 && currentMatch?.status === 'waiting') {
        startMatch(matchId);
      }
    }
  };

  const checkFirstMatchAchievement = async (userId: string) => {
    try {
      const { data: stats } = await supabase
        .from('arena_stats')
        .select('matches_played')
        .eq('user_id', userId)
        .single();
      
      if (!stats || stats.matches_played === 0) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: 'first-match'
          });
        
        toast({
          title: "Achievement Unlocked!",
          description: "First Match: Participated in your first quiz match",
        });
      }
    } catch (error) {
      console.error('Error checking for first match achievement:', error);
    }
  };

  const checkForAchievements = async (userId: string, matchId: string) => {
    try {
      const { data: playerData } = await supabase
        .from('match_players')
        .select('*')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .single();
      
      if (!playerData) return;
      
      if (playerData.questions_answered === playerData.correct_answers && playerData.questions_answered > 0) {
        await awardAchievement(userId, 'perfect-score');
      }
      
      const { data: stats } = await supabase
        .from('arena_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!stats) return;
      
      if (stats.matches_won === 1) {
        await awardAchievement(userId, 'first-win');
      }
      
      if (stats.matches_played === 5) {
        await awardAchievement(userId, 'five-matches');
      }
    } catch (error) {
      console.error('Error checking for achievements:', error);
    }
  };

  const awardAchievement = async (userId: string, achievementId: string) => {
    try {
      const { data } = await supabase
        .from('user_achievements')
        .select()
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);
      
      if (data && data.length > 0) return;
      
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId
        });
      
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement.name}: ${achievement.description}`,
        });
      }
      
      fetchAchievements();
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  };

  const leaveMatch = useCallback(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    
    setCurrentMatch(null);
    setPlayers([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setMatchComplete(false);
  }, [unsubscribe]);

  useEffect(() => {
    setIsLoading(true);
    
    fetchUserStats();
    fetchLeaderboard();
    fetchAchievements();
    
    setIsLoading(false);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchUserStats, fetchLeaderboard, fetchAchievements, unsubscribe]);

  useEffect(() => {
    if (!currentMatch || currentMatch.status !== 'active' || matchComplete || !questions.length) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            return 15;
          } else {
            clearInterval(timer);
            finishMatch();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentMatch, currentQuestionIndex, questions.length, matchComplete]);

  return {
    isLoading,
    currentMatch,
    players,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    matchComplete,
    arenaStats,
    leaderboard,
    achievements,
    joinMatch,
    answerQuestion,
    leaveMatch,
    fetchUserStats,
    fetchLeaderboard,
    fetchAchievements,
  };
};
