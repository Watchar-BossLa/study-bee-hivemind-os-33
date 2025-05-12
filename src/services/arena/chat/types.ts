
import { ExtendedTables } from '@/types/supabase-extensions';

// Export types for use in the application
export type ChatMessage = ExtendedTables['arena_chat_messages']['Row'];
export type TypingStatus = ExtendedTables['arena_typing_status']['Row'];
