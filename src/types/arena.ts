
export type QuizQuestion = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
};

export type ArenaMatch = {
  id: string;
  status: 'waiting' | 'active' | 'completed';
  start_time: string | null;
  end_time: string | null;
};

export type MatchPlayer = {
  id: string;
  match_id: string;
  user_id: string;
  score: number;
  questions_answered: number;
  correct_answers: number;
};

export type ArenaStats = {
  matches_played: number;
  matches_won: number;
  total_score: number;
  highest_score: number;
  questions_answered: number;
  correct_answers: number;
  last_match_date: string | null;
};
