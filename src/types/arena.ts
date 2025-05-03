
// Update or create the arena.ts file to include QuizQuestion type with correct difficulty values
export interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface ArenaMatch {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  start_time: string | null;
  end_time: string | null;
  subject_focus?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface MatchPlayer {
  id: string;
  match_id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  questions_answered: number;
  total_response_time: number;
  streak: number;
  joined_at: string;
}

// Database representation of a match player
export interface DbMatchPlayer {
  id: string;
  match_id: string;
  user_id: string;
  score: number;
  correct_answers: number;
  questions_answered: number;
  total_response_time?: number;
  streak?: number;
  created_at: string | null;
}

// Type for answers in arena mode
export type QuizAnswer = 'a' | 'b' | 'c' | 'd' | 'none';

// Add missing interface for Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// Add missing interface for LeaderboardEntry
export interface LeaderboardEntry {
  user_id: string;
  username?: string;
  matches_played: number;
  matches_won: number;
  total_score: number;
  highest_score: number;
  win_rate: number;
}

// Add missing interface for ArenaStats
export interface ArenaStats {
  user_id: string;
  matches_played: number;
  matches_won: number;
  total_score: number;
  highest_score: number;
  questions_answered: number;
  correct_answers: number;
  avg_response_time?: number;
  created_at?: string;
  updated_at?: string;
}

// Add missing interface for UpdatePlayerProgressParams
export interface UpdatePlayerProgressParams {
  match_id_param: string;
  user_id_param: string;
  score_to_add: number;
  is_correct: boolean;
  response_time_param: number;
}
