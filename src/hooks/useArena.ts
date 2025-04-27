
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ArenaMatch, MatchPlayer, QuizQuestion, ArenaStats, LeaderboardEntry, Achievement } from '@/types/arena';

export const useArena = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMatch, setCurrentMatch] = useState<ArenaMatch | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [matchComplete, setMatchComplete] = useState(false);
  const [arenaStats, setArenaStats] = useState<ArenaStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unsubscribe, setUnsubscribe] = useState<() => void | null>(() => null);
  const { toast } = useToast();

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: stats } = await supabase
        .from('arena_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (stats) {
        setArenaStats(stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, []);

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('arena_stats')
        .select('*')
        .order('highest_score', { ascending: false })
        .limit(10);

      if (data) {
        const formattedLeaderboard: LeaderboardEntry[] = data.map((entry) => ({
          user_id: entry.user_id,
          username: entry.user_id.substring(0, 8), // Placeholder for user name
          matches_played: entry.matches_played,
          matches_won: entry.matches_won,
          total_score: entry.total_score,
          highest_score: entry.highest_score,
        }));
        
        setLeaderboard(formattedLeaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }, []);

  // Fetch user achievements
  const fetchAchievements = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's earned achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      // Define all possible achievements
      const allAchievements: Achievement[] = [
        {
          id: 'first-match',
          name: 'First Match',
          description: 'Participated in your first quiz match',
          icon: 'award',
          earned: false,
        },
        {
          id: 'first-win',
          name: 'First Win',
          description: 'Won your first quiz match',
          icon: 'trophy',
          earned: false,
        },
        {
          id: 'perfect-score',
          name: 'Perfect Score',
          description: 'Answered all questions correctly in a match',
          icon: 'star',
          earned: false,
        },
        {
          id: 'five-matches',
          name: 'Quiz Enthusiast',
          description: 'Participated in 5 quiz matches',
          icon: 'medal',
          earned: false,
        }
      ];

      // Mark achievements as earned if they exist in userAchievements
      if (userAchievements) {
        userAchievements.forEach((achievement) => {
          const index = allAchievements.findIndex(a => a.id === achievement.achievement_id);
          if (index !== -1) {
            allAchievements[index].earned = true;
            allAchievements[index].earned_at = achievement.earned_at;
          }
        });
      }

      setAchievements(allAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, []);

  // Join a match
  const joinMatch = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // First try to find an existing waiting match
      let { data: existingMatch } = await supabase
        .from('arena_matches')
        .select()
        .eq('status', 'waiting')
        .single();

      let matchId: string;

      if (!existingMatch) {
        // Create new match if none exists
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

      // Join the match
      const { error: joinError } = await supabase
        .from('match_players')
        .insert({ match_id: matchId, user_id: user.id });

      if (joinError) throw joinError;

      // Subscribe to match updates
      const unsub = subscribeToMatch(matchId);
      setUnsubscribe(() => unsub);
      
      toast({
        title: "Joined match",
        description: "Waiting for other players...",
      });

      // Check if this is the user's first match (for achievement)
      checkFirstMatchAchievement(user.id);

    } catch (error) {
      toast({
        title: "Error joining match",
        description: "Failed to join match",
        variant: "destructive",
      });
    }
  };

  // Start match when enough players join
  const startMatch = useCallback(async (matchId: string) => {
    try {
      // Fetch random questions for the match
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
        
        // Update match status to active
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

  // Answer a question
  const answerQuestion = async (answer: 'a' | 'b' | 'c' | 'd') => {
    if (!currentMatch || selectedAnswer || currentQuestionIndex >= questions.length) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update player's score
      const scoreToAdd = isCorrect ? calculateScore(currentQuestion.difficulty) : 0;
      
      await supabase.rpc('update_player_progress', {
        match_id_param: currentMatch.id,
        user_id_param: user.id,
        score_to_add: scoreToAdd,
        is_correct: isCorrect
      });

      // Move to next question after a delay
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

  // Calculate score based on difficulty
  const calculateScore = (difficulty: string): number => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 10;
    }
  };

  // Finish the match
  const finishMatch = async () => {
    if (!currentMatch) return;
    
    try {
      // Update match status
      await supabase
        .from('arena_matches')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
        })
        .eq('id', currentMatch.id);
      
      setMatchComplete(true);
      
      // Check for achievements
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        checkForAchievements(user.id, currentMatch.id);
      }
      
      // Refresh stats
      fetchUserStats();
      fetchLeaderboard();

    } catch (error) {
      console.error('Error finishing match:', error);
    }
  };

  // Subscribe to match updates
  const subscribeToMatch = (matchId: string) => {
    // Subscribe to the match players
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

    // Subscribe to the match itself
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

  // Fetch match details
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
      
      // If match has become active, start the game
      if (data.status === 'active' && questions.length === 0) {
        startMatch(matchId);
      }
    }
  };

  // Fetch players in a match
  const fetchMatchPlayers = async (matchId: string) => {
    const { data } = await supabase
      .from('match_players')
      .select()
      .eq('match_id', matchId);
    
    if (data) {
      setPlayers(data);
      
      // Auto-start match when 2-4 players have joined (for demo purposes, normally would wait for more)
      if (data.length >= 2 && currentMatch?.status === 'waiting') {
        startMatch(matchId);
      }
    }
  };

  // Check for the first match achievement
  const checkFirstMatchAchievement = async (userId: string) => {
    try {
      const { data: stats } = await supabase
        .from('arena_stats')
        .select('matches_played')
        .eq('user_id', userId)
        .single();
      
      if (!stats || stats.matches_played === 0) {
        // This is the user's first match
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

  // Check for various achievements after a match
  const checkForAchievements = async (userId: string, matchId: string) => {
    try {
      // Get player's match data
      const { data: playerData } = await supabase
        .from('match_players')
        .select('*')
        .eq('match_id', matchId)
        .eq('user_id', userId)
        .single();
      
      if (!playerData) return;
      
      // Perfect score achievement
      if (playerData.questions_answered === playerData.correct_answers && playerData.questions_answered > 0) {
        await awardAchievement(userId, 'perfect-score');
      }
      
      // Get user stats for other achievements
      const { data: stats } = await supabase
        .from('arena_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!stats) return;
      
      // First win achievement
      if (stats.matches_won === 1) {
        await awardAchievement(userId, 'first-win');
      }
      
      // Five matches achievement
      if (stats.matches_played === 5) {
        await awardAchievement(userId, 'five-matches');
      }
    } catch (error) {
      console.error('Error checking for achievements:', error);
    }
  };

  // Award an achievement if not already earned
  const awardAchievement = async (userId: string, achievementId: string) => {
    try {
      // Check if already earned
      const { data } = await supabase
        .from('user_achievements')
        .select()
        .eq('user_id', userId)
        .eq('achievement_id', achievementId);
      
      if (data && data.length > 0) return; // Already earned
      
      // Award the achievement
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievementId
        });
      
      // Find achievement details to show in toast
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement.name}: ${achievement.description}`,
        });
      }
      
      // Refresh achievements
      fetchAchievements();
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  };

  // Leave match - cleanup
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

  // Initialize 
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch initial data
    fetchUserStats();
    fetchLeaderboard();
    fetchAchievements();
    
    setIsLoading(false);

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchUserStats, fetchLeaderboard, fetchAchievements, unsubscribe]);

  // Timer effect for questions
  useEffect(() => {
    if (!currentMatch || currentMatch.status !== 'active' || matchComplete || !questions.length) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up, move to next question
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
