
import { useCallback } from 'react';
import { arenaService } from '@/services/ArenaService';
import { ErrorHandler } from '@/utils/errorHandling';
import { ArenaMatchConfig } from '@/services/ArenaService';

export const useArenaOperations = () => {
  const findMatch = useCallback(async (userId: string, config?: ArenaMatchConfig) => {
    try {
      const result = await arenaService.findMatch(userId, config);
      if (!result.success || !result.data) {
        throw result.error || new Error('Failed to find match');
      }
      return result.data;
    } catch (error) {
      ErrorHandler.handle(error, 'arena-match-finding');
      return null;
    }
  }, []);

  const joinMatch = useCallback(async (matchId: string, userId: string) => {
    try {
      const result = await arenaService.joinMatch(matchId, userId);
      if (!result.success) {
        throw result.error || new Error('Failed to join match');
      }
      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'arena-match-joining');
      return false;
    }
  }, []);

  const loadQuestions = useCallback(async (count: number = 10) => {
    try {
      const result = await arenaService.getQuestions(count);
      if (!result.success || !result.data) {
        throw result.error || new Error('Failed to load questions');
      }
      return result.data;
    } catch (error) {
      ErrorHandler.handle(error, 'arena-questions-loading');
      return [];
    }
  }, []);

  const submitAnswer = useCallback(async (
    matchId: string,
    userId: string,
    questionId: string,
    answer: string,
    isCorrect: boolean,
    responseTime: number
  ) => {
    try {
      const result = await arenaService.submitAnswer(
        matchId,
        userId,
        questionId,
        answer,
        isCorrect,
        responseTime
      );
      
      if (!result.success) {
        throw result.error || new Error('Failed to submit answer');
      }
      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'arena-answer-submission');
      return false;
    }
  }, []);

  return {
    findMatch,
    joinMatch,
    loadQuestions,
    submitAnswer
  };
};
