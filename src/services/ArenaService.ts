
import { BaseService, ServiceResponse } from './base/BaseService';
import { supabase } from '@/integrations/supabase/client';
import { ArenaMatch, MatchPlayer, QuizQuestion } from '@/types/arena';

export interface ArenaMatchConfig {
  subject?: string;
  difficulty?: string;
  questionCount?: number;
}

export class ArenaService extends BaseService {
  constructor() {
    super({ retryAttempts: 2, timeout: 10000 });
  }

  async findMatch(userId: string, config?: ArenaMatchConfig): Promise<ServiceResponse<ArenaMatch>> {
    return this.executeWithRetry(async () => {
      // Try to find existing waiting match
      const { data: existingMatches, error: findError } = await supabase
        .from('arena_matches')
        .select('*')
        .eq('status', 'waiting')
        .limit(1);

      if (findError) throw findError;

      if (existingMatches && existingMatches.length > 0) {
        return existingMatches[0] as ArenaMatch;
      }

      // Create new match
      const { data: newMatch, error: createError } = await supabase
        .from('arena_matches')
        .insert({
          status: 'waiting',
          start_time: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;
      return newMatch as ArenaMatch;
    }, 'arena-match-finding');
  }

  async joinMatch(matchId: string, userId: string): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { error } = await supabase
        .from('match_players')
        .insert({
          match_id: matchId,
          user_id: userId,
          score: 0,
          questions_answered: 0,
          correct_answers: 0
        });

      if (error) throw error;
    }, 'arena-match-joining');
  }

  async getMatchPlayers(matchId: string): Promise<ServiceResponse<MatchPlayer[]>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('match_players')
        .select('*')
        .eq('match_id', matchId);

      if (error) throw error;
      
      // Map database fields to MatchPlayer interface
      const players: MatchPlayer[] = (data || []).map(player => ({
        id: player.id,
        match_id: player.match_id,
        user_id: player.user_id,
        score: player.score || 0,
        correct_answers: player.correct_answers || 0,
        questions_answered: player.questions_answered || 0,
        total_response_time: player.total_response_time || 0,
        streak: player.streak || 0,
        joined_at: player.created_at || new Date().toISOString() // Map created_at to joined_at
      }));
      
      return players;
    }, 'arena-players-fetching');
  }

  async getQuestions(count: number = 10): Promise<ServiceResponse<QuizQuestion[]>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .limit(count);

      if (error) throw error;
      return (data || []) as QuizQuestion[];
    }, 'arena-questions-fetching');
  }

  async submitAnswer(
    matchId: string,
    userId: string,
    questionId: string,
    answer: string,
    isCorrect: boolean,
    responseTime: number
  ): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const score = isCorrect ? 10 : 0;
      
      const { error } = await supabase.rpc('update_player_progress', {
        match_id_param: matchId,
        user_id_param: userId,
        score_to_add: score,
        is_correct: isCorrect
      });

      if (error) throw error;
    }, 'arena-answer-submission');
  }
}

export const arenaService = new ArenaService();
