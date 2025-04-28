
export interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  subject?: string;
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

export interface ArenaMatch {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  start_time: string | null;
  end_time: string | null;
  subject_focus?: string;
}

export interface ArenaStats {
  matches_played: number;
  matches_won: number;
  questions_answered: number;
  correct_answers: number;
  total_score: number;
  highest_score: number;
  average_response_time?: number;
}

export interface LeaderboardEntry {
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  total_score: number;
  highest_score?: number;
  matches_played: number;
  matches_won: number;
  win_rate: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}
