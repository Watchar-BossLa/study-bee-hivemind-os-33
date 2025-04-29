
import { useState, useEffect } from 'react';
import { useArenaMatch } from './useArenaMatch';
import { useArenaQuestion } from './useArenaQuestion';
import { useArenaStats } from './useArenaStats';
import { useArenaAchievements } from './useArenaAchievements';
import { supabase } from '@/integrations/supabase/client';
import { QuizAnswer } from '@/types/arena';

export const useArena = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    currentMatch, 
    players, 
    matchComplete, 
    joinMatch, 
    finishMatch, 
    leaveMatch 
  } = useArenaMatch();

  const {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    setTimeLeft,
    fetchQuestions,
    answerQuestion,
    resetQuestions,
    moveToNextQuestion,
    resetTimer
  } = useArenaQuestion(currentMatch?.id ?? null);

  const { 
    arenaStats, 
    leaderboard, 
    fetchUserStats, 
    fetchLeaderboard 
  } = useArenaStats();

  const { 
    achievements, 
    fetchAchievements, 
    awardAchievement 
  } = useArenaAchievements();

  // Initial data fetching
  useEffect(() => {
    setIsLoading(true);
    
    fetchUserStats();
    fetchLeaderboard();
    fetchAchievements();
    
    setIsLoading(false);

    return () => {
      leaveMatch();
    };
  }, [fetchUserStats, fetchLeaderboard, fetchAchievements, leaveMatch]);

  // Handle active match timer
  useEffect(() => {
    if (!currentMatch || currentMatch.status !== 'active' || matchComplete || !questions.length) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestionIndex < questions.length - 1) {
            // Move to next question when time runs out
            if (selectedAnswer === null) {
              // Pass 'none' instead of 'x'
              answerQuestion('none'); 
            }
            moveToNextQuestion(questions.length);
            resetTimer();
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
  }, [
    currentMatch, 
    currentQuestionIndex, 
    questions.length, 
    matchComplete, 
    finishMatch, 
    selectedAnswer, 
    answerQuestion,
    moveToNextQuestion, 
    resetTimer,
    setTimeLeft
  ]);

  // Fetch questions when match becomes active
  useEffect(() => {
    if (currentMatch?.status === 'active' && questions.length === 0) {
      fetchQuestions();
    }
  }, [currentMatch?.status, questions.length, fetchQuestions]);

  // Check for achievements when match completes
  const checkForAchievements = async (userId: string, matchId: string) => {
    const { data: playerData } = await supabase
      .from('match_players')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', userId)
      .single();

    if (!playerData) return;

    // First match achievement
    await awardAchievement(userId, 'first-match');

    // Perfect score achievement
    if (playerData.questions_answered > 0 && playerData.correct_answers === playerData.questions_answered) {
      await awardAchievement(userId, 'perfect-score');
    }

    // Check if won the match
    const isWinner = players.every(p => p.user_id === userId || p.score < playerData.score);
    if (isWinner) {
      await awardAchievement(userId, 'first-win');
    }
    
    // High score achievement
    if (playerData.score >= 100) {
      await awardAchievement(userId, 'high-score');
    }
    
    // Quick responder achievement - safely handle potentially missing property
    const totalResponseTime = playerData.total_response_time || 0;
    const averageResponseTime = playerData.questions_answered > 0 ? 
      totalResponseTime / playerData.questions_answered : 
      0;
      
    if (averageResponseTime <= 5 && playerData.questions_answered >= 3) {
      await awardAchievement(userId, 'quick-responder');
    }
  };

  // Handle match completion
  useEffect(() => {
    const handleMatchComplete = async () => {
      if (matchComplete && currentMatch) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await checkForAchievements(user.id, currentMatch.id);
        }
        
        fetchUserStats();
        fetchLeaderboard();
        resetQuestions();
      }
    };

    handleMatchComplete();
  }, [matchComplete, currentMatch, fetchUserStats, fetchLeaderboard, resetQuestions]);

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
    leaveMatch
  };
};
