
export interface TypingStatus {
  user_id: string;
  match_id: string;
  is_typing: boolean;
  last_updated: string;
}

export interface ArenaTypingStatusTable {
  user_id: string;
  match_id: string;
  is_typing: boolean;
  last_updated: string;
}
