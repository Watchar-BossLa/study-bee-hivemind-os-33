
export interface ChatMessage {
  id: string;
  match_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface ArenaChatMessagesTable {
  id: string;
  match_id: string;
  user_id: string;
  content: string;
  created_at: string;
}
