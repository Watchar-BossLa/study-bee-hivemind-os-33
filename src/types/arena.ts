
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
